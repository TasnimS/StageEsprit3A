package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.entities.Etudiant;
import com.example.SujetStage.entities.LienEvaluation;
import com.example.SujetStage.repositories.FormulaireRepository;
import com.example.SujetStage.repositories.EtudiantRepository;
import com.example.SujetStage.repositories.LienEvaluationRepository;
import com.example.SujetStage.services.FormulaireService;
import com.example.SujetStage.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/formulaires")
public class FormulaireController {

    @Autowired
    private FormulaireService formulaireService;
    
    @Autowired
    private EtudiantRepository etudiantRepository;
    
    @Autowired
    private LienEvaluationRepository lienEvaluationRepository;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/add")
    public ResponseEntity<?> ajouterFormulaire(@RequestBody Formulaire f) {
        try {
            System.out.println("Received formulaire: " + f.getTitre());
            Formulaire saved = formulaireService.addFormulaire(f);
            System.out.println("Formulaire saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving formulaire: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Formulaire> getAllFormulaires() {
        return formulaireService.getAllFormulaires();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formulaire> getFormulaireById(@PathVariable int id) {
        return formulaireService.getFormulaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formulaire> updateFormulaire(@PathVariable int id, @RequestBody Formulaire f) {
        if (!formulaireService.getFormulaireById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        f.setId(id);
        return ResponseEntity.ok(formulaireService.updateFormulaire(f));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormulaire(@PathVariable int id) {
        if (!formulaireService.getFormulaireById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        formulaireService.deleteFormulaire(id);
        return ResponseEntity.noContent().build();
    }
    
    // Send evaluation link via email
    @PostMapping("/{formId}/send-link")
    public ResponseEntity<String> sendEvaluationLink(@PathVariable int formId, @RequestBody SendLinkRequest request) {
        try {
            System.out.println("=== SEND EMAIL REQUEST ===");
            System.out.println("FormId: " + formId);
            System.out.println("EvaluatorId: " + request.getEvaluatorId());
            System.out.println("LinkToken: " + request.getLinkToken());
            
            // Get the formulaire
            Optional<Formulaire> formulaireOpt = formulaireService.getFormulaireById(formId);
            if (!formulaireOpt.isPresent()) {
                System.out.println("Formulaire non trouvé avec ID: " + formId);
                return ResponseEntity.badRequest().body("Formulaire non trouvé");
            }
            Formulaire formulaire = formulaireOpt.get();
            System.out.println("Formulaire trouvé: " + formulaire.getTitre());
            
            // Get the evaluator
            Optional<Etudiant> etudiantOpt = etudiantRepository.findById(request.getEvaluatorId());
            if (!etudiantOpt.isPresent()) {
                System.out.println("Évaluateur non trouvé avec ID: " + request.getEvaluatorId());
                return ResponseEntity.badRequest().body("Évaluateur non trouvé");
            }
            Etudiant etudiant = etudiantOpt.get();
            System.out.println("Évaluateur trouvé: " + etudiant.getNom() + " (" + etudiant.getEmail() + ")");
            
            // Get the link by token
            Optional<LienEvaluation> lienOpt = lienEvaluationRepository.findByToken(request.getLinkToken());
            if (!lienOpt.isPresent()) {
                System.out.println("Lien non trouvé avec token: " + request.getLinkToken());
                return ResponseEntity.badRequest().body("Lien non trouvé");
            }
            LienEvaluation lien = lienOpt.get();
            System.out.println("Lien trouvé: " + lien.getToken());
            
            // Send email
            emailService.sendEvaluationLink(
                etudiant.getEmail(),
                etudiant.getNom(),
                formulaire.getTitre(),
                lien.getToken()
            );
            
            return ResponseEntity.ok("Email envoyé avec succès à " + etudiant.getEmail());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
    
    // Request class for sending links
    public static class SendLinkRequest {
        private Long evaluatorId;
        private String linkToken;
        
        public Long getEvaluatorId() { return evaluatorId; }
        public void setEvaluatorId(Long evaluatorId) { this.evaluatorId = evaluatorId; }
        
        public String getLinkToken() { return linkToken; }
        public void setLinkToken(String linkToken) { this.linkToken = linkToken; }
    }
    
    // Test email endpoint
    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestBody TestEmailRequest request) {
        try {
            System.out.println("=== TEST EMAIL ENDPOINT ===");
            System.out.println("Request received: " + request.getToEmail() + ", " + request.getEvaluatorName());
            
            emailService.sendEvaluationLink(
                request.getToEmail(),
                request.getEvaluatorName(),
                request.getFormTitle(),
                "test-token-123"
            );
            return ResponseEntity.ok("Email de test envoyé avec succès (simulation)");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'envoi de l'email de test: " + e.getMessage());
        }
    }
    
    // Request class for test email
    public static class TestEmailRequest {
        private String toEmail;
        private String evaluatorName;
        private String formTitle;
        
        public String getToEmail() { return toEmail; }
        public void setToEmail(String toEmail) { this.toEmail = toEmail; }
        
        public String getEvaluatorName() { return evaluatorName; }
        public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
        
        public String getFormTitle() { return formTitle; }
        public void setFormTitle(String formTitle) { this.formTitle = formTitle;         }
    }
    
    // Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Backend is working!");
    }
    
    // Test endpoint for debugging send-link
    @PostMapping("/{formId}/send-link-debug")
    public ResponseEntity<String> sendLinkDebug(@PathVariable int formId, @RequestBody SendLinkRequest request) {
        System.out.println("=== DEBUG ENDPOINT ===");
        System.out.println("FormId: " + formId);
        System.out.println("Request: " + request);
        System.out.println("EvaluatorId: " + request.getEvaluatorId());
        System.out.println("LinkToken: " + request.getLinkToken());
        return ResponseEntity.ok("Debug endpoint working - FormId: " + formId + ", EvaluatorId: " + request.getEvaluatorId() + ", LinkToken: " + request.getLinkToken());
    }
}
