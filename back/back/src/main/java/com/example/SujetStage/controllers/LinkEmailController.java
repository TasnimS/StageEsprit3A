package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.entities.Etudiant;
import com.example.SujetStage.entities.LienEvaluation;
import com.example.SujetStage.repositories.FormulaireRepository;
import com.example.SujetStage.repositories.EtudiantRepository;
import com.example.SujetStage.repositories.LienEvaluationRepository;
import com.example.SujetStage.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/forms")
public class LinkEmailController {

    @Autowired
    private FormulaireRepository formulaireRepository;
    
    @Autowired
    private EtudiantRepository etudiantRepository;
    
    @Autowired
    private LienEvaluationRepository lienEvaluationRepository;
    
    @Autowired
    private EmailService emailService;

    // Send evaluation link via email
    @PostMapping("/{formId}/send-link")
    public ResponseEntity<String> sendEvaluationLink(@PathVariable int formId, @RequestBody SendLinkRequest request) {
        try {
            System.out.println("=== SEND EMAIL REQUEST ===");
            System.out.println("FormId: " + formId);
            System.out.println("EvaluatorId: " + request.getEvaluatorId());
            System.out.println("LinkToken: " + request.getLinkToken());
            
            // Get the formulaire
            Optional<Formulaire> formulaireOpt = formulaireRepository.findById(formId);
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
