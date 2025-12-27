package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.entities.LienEvaluation;
import com.example.SujetStage.entities.Question;
import com.example.SujetStage.entities.ReponseFormulaire;
import com.example.SujetStage.entities.ReponseQuestion;
import com.example.SujetStage.services.FormulaireService;
import com.example.SujetStage.services.LienEvaluationService;
import com.example.SujetStage.services.QuestionService;
import com.example.SujetStage.services.ReponseFormulaireService;
import com.example.SujetStage.services.ReponseQuestionService;
import com.example.SujetStage.services.EmailService;
import com.example.SujetStage.repositories.UserRepository;
import com.example.SujetStage.repositories.EtudiantRepository;
import com.example.SujetStage.entities.User;
import com.example.SujetStage.entities.Etudiant;
import io.jsonwebtoken.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/forms")
public class EvaluationLinkController {

    private final LienEvaluationService lienService;
    private final FormulaireService formulaireService;
    private final QuestionService questionService;
    private final ReponseFormulaireService reponseFormulaireService;
    private final ReponseQuestionService reponseQuestionService;
    private final SecretKey jwtSecretKey;
    private final UserRepository userRepository;
    private final EtudiantRepository etudiantRepository;
    private final EmailService emailService;

    public EvaluationLinkController(LienEvaluationService lienService,
                                    FormulaireService formulaireService,
                                    QuestionService questionService,
                                    ReponseFormulaireService reponseFormulaireService,
                                    ReponseQuestionService reponseQuestionService,
                                    @Value("${app.jwt-secret}") String jwtSecret,
                                    UserRepository userRepository,
                                    EtudiantRepository etudiantRepository,
                                    EmailService emailService) {
        this.lienService = lienService;
        this.formulaireService = formulaireService;
        this.questionService = questionService;
        this.reponseFormulaireService = reponseFormulaireService;
        this.reponseQuestionService = reponseQuestionService;
        this.jwtSecretKey = io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.userRepository = userRepository;
        this.etudiantRepository = etudiantRepository;
        this.emailService = emailService;
    }

    public record GenerateLinkRequest(String evaluatorEmail, Long evaluatorId, Integer expirationHours) {}

    @PostMapping("/{formId}/generate-link")
    public ResponseEntity<Map<String, String>> generateLink(@PathVariable int formId,
                                                            @RequestBody(required = false) GenerateLinkRequest req) {
        int expirationHours = (req != null && req.expirationHours() != null) ? req.expirationHours() : 72;
        String evaluatorEmail = (req != null) ? req.evaluatorEmail() : null;
        Long evaluatorId = (req != null && req.evaluatorId() != null) ? req.evaluatorId() : null;

        String token = lienService.generateToken(formId, evaluatorEmail, evaluatorId, expirationHours);
        String url = "http://localhost:3000/formulaire/" + token;
        Map<String, String> body = new HashMap<>();
        body.put("token", token);
        body.put("url", url);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{formId}/responses")
    public ResponseEntity<List<Map<String, Object>>> getResponsesByForm(@PathVariable int formId) {
        var responses = reponseFormulaireService.getReponsesByFormulaireId(formId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (ReponseFormulaire rf : responses) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", rf.getId());
            row.put("commentaire", rf.getCommentaire());
            row.put("noteGlobal", rf.getNoteGlobal());
            row.put("idUtilisateur", rf.getIdUtilisateur());
            row.put("idFormulaire", rf.getIdFormulaire());
            row.put("dateSoumission", rf.getDateSoumission());
            String email = null;
            // Try to get email from Etudiant (evaluator) first
            if (rf.getEvaluatorId() != null) {
                email = etudiantRepository.findById(rf.getEvaluatorId()).map(Etudiant::getEmail).orElse(null);
            }
            // Fallback to User table if evaluator not found
            if (email == null && rf.getIdUtilisateur() != 0) {
                email = userRepository.findById((long) rf.getIdUtilisateur()).map(User::getEmail).orElse(null);
            }
            row.put("evaluatorEmail", email);
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/access/{token}")
    public ResponseEntity<?> accessForm(@PathVariable String token) {
        // Validate token and expiration
        Optional<LienEvaluation> opt = lienService.findByToken(token);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("Lien invalide");
        }
        LienEvaluation lien = opt.get();
        if (lien.getExpiration().isBefore(Instant.now())) {
            return ResponseEntity.status(410).body("Lien expiré");
        }

        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(token);
            Integer formId = claimsJws.getBody().get("formId", Integer.class);
            Long evaluatorId = claimsJws.getBody().get("evaluatorId", Long.class);

            Optional<Formulaire> formOpt = formulaireService.getFormulaireById(formId);
            if (formOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Formulaire introuvable");
            }

            List<Question> questions = questionService.getQuestionsByFormulaireId(formId);
            Map<String, Object> resp = new HashMap<>();
            resp.put("formulaire", formOpt.get());
            resp.put("questions", questions);
            resp.put("evaluatorId", evaluatorId);
            return ResponseEntity.ok(resp);
        } catch (JwtException e) {
            return ResponseEntity.status(400).body("Token invalide");
        }
    }

    @GetMapping("/{formId}/links")
    public ResponseEntity<List<Map<String, Object>>> listLinks(@PathVariable int formId) {
        List<LienEvaluation> links = lienService.findByFormId(formId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (LienEvaluation l : links) {
            Map<String, Object> row = new HashMap<>();
            row.put("token", l.getToken());
            row.put("expiration", l.getExpiration());
            row.put("createdAt", l.getCreatedAt());
            row.put("url", "http://localhost:3000/formulaire/" + l.getToken());
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }

    public static class SubmitAnswerRequest {
        public String commentaire;
        public Integer idUtilisateur; // optional if anonymous
        public Long evaluatorId; // ID de l'évaluateur (étudiant)
        public Map<Integer, String> questionAnswers; // questionId -> value
    }

    @PostMapping("/submit/{token}")
    public ResponseEntity<?> submitAnswers(@PathVariable String token,
                                           @RequestBody SubmitAnswerRequest request) {
        Optional<LienEvaluation> opt = lienService.findByToken(token);
        if (opt.isEmpty() || opt.get().getExpiration().isBefore(Instant.now())) {
            return ResponseEntity.status(400).body("Lien invalide ou expiré");
        }

        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(token);
            Integer formId = claimsJws.getBody().get("formId", Integer.class);

            // Calculate noteGlobal based on question answers and their bareme
            float noteGlobal = 0.0f;
            if (request.questionAnswers != null && !request.questionAnswers.isEmpty()) {
                List<Question> questions = questionService.getQuestionsByFormulaireId(formId);
                Map<Integer, Question> questionMap = new HashMap<>();
                for (Question q : questions) {
                    questionMap.put(q.getId(), q);
                }
                
                // Sum up all baremes for answered questions
                for (Map.Entry<Integer, String> entry : request.questionAnswers.entrySet()) {
                    Question question = questionMap.get(entry.getKey());
                    if (question != null && entry.getValue() != null && !entry.getValue().trim().isEmpty()) {
                        noteGlobal += question.getBareme();
                    }
                }
            }

            // Create form response
            ReponseFormulaire rf = new ReponseFormulaire(
                    request.commentaire != null ? request.commentaire : "",
                    noteGlobal,
                    request.idUtilisateur != null ? request.idUtilisateur : 0,
                    formId,
                    request.evaluatorId
            );
            rf = reponseFormulaireService.addReponseFormulaire(rf);

            // Save each question answer
            if (request.questionAnswers != null) {
                for (Map.Entry<Integer, String> entry : request.questionAnswers.entrySet()) {
                    ReponseQuestion rq = new ReponseQuestion(entry.getValue(), entry.getKey(), rf.getId());
                    reponseQuestionService.addReponseQuestion(rq);
                }
            }

            return ResponseEntity.ok("Réponses enregistrées");
        } catch (JwtException e) {
            return ResponseEntity.status(400).body("Token invalide");
        }
    }

    @PostMapping("/{formId}/send-responses-email")
    public ResponseEntity<String> sendResponsesEmail(@PathVariable int formId,
                                                      @RequestBody SendResponsesEmailRequest request) {
        try {
            Optional<Formulaire> formOpt = formulaireService.getFormulaireById(formId);
            if (formOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Formulaire non trouvé");
            }
            Formulaire formulaire = formOpt.get();

            // Get all responses for this form
            List<ReponseFormulaire> responses = reponseFormulaireService.getReponsesByFormulaireId(formId);
            if (responses.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucune réponse disponible pour ce formulaire");
            }

            // Get all questions for this form
            List<Question> questions = questionService.getQuestionsByFormulaireId(formId);
            Map<Integer, Question> questionMap = new HashMap<>();
            float noteMax = 0.0f;
            for (Question q : questions) {
                questionMap.put(q.getId(), q);
                noteMax += q.getBareme();
            }

            // Build summary list
            List<EmailService.FormResponseSummary> summaries = new ArrayList<>();
            for (ReponseFormulaire rf : responses) {
                EmailService.FormResponseSummary summary = new EmailService.FormResponseSummary();
                
                // Get evaluator info
                String evaluatorName = null;
                String evaluatorEmail = null;
                if (rf.getEvaluatorId() != null) {
                    Optional<Etudiant> etudiantOpt = etudiantRepository.findById(rf.getEvaluatorId());
                    if (etudiantOpt.isPresent()) {
                        Etudiant etudiant = etudiantOpt.get();
                        evaluatorName = etudiant.getNom();
                        evaluatorEmail = etudiant.getEmail();
                    }
                }
                if (evaluatorName == null && rf.getIdUtilisateur() != 0) {
                    Optional<User> userOpt = userRepository.findById((long) rf.getIdUtilisateur());
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        evaluatorName = user.getNom();
                        evaluatorEmail = user.getEmail();
                    }
                }

                summary.setEvaluatorName(evaluatorName != null ? evaluatorName : "Anonyme");
                summary.setEvaluatorEmail(evaluatorEmail);
                summary.setNoteGlobal(rf.getNoteGlobal());
                summary.setNoteMax(noteMax);
                summary.setCommentaire(rf.getCommentaire());
                if (rf.getDateSoumission() != null) {
                    summary.setDateSoumission(rf.getDateSoumission().toString());
                }

                // Get question answers
                List<ReponseQuestion> reponsesQuestions = reponseQuestionService.getReponsesByReponseFormulaireId(rf.getId());
                Map<String, String> questionAnswers = new HashMap<>();
                for (ReponseQuestion rq : reponsesQuestions) {
                    Question question = questionMap.get(rq.getIdQuestion());
                    if (question != null) {
                        questionAnswers.put(question.getLibelle(), rq.getValeur());
                    }
                }
                summary.setQuestionAnswers(questionAnswers);

                summaries.add(summary);
            }

            // Send email
            emailService.sendFormResponsesSummary(
                request.getToEmail(),
                formulaire.getTitre(),
                summaries
            );

            return ResponseEntity.ok("Email de résumé envoyé avec succès à " + request.getToEmail());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }

    public static class SendResponsesEmailRequest {
        private String toEmail;

        public String getToEmail() { return toEmail; }
        public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    }
}


