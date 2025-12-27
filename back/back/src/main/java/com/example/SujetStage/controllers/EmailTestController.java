package com.example.SujetStage.controllers;

import com.example.SujetStage.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/email-test")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-test")
    public ResponseEntity<String> sendTestEmail(@RequestBody TestEmailRequest request) {
        try {
            System.out.println("=== TEST EMAIL ENDPOINT ===");
            System.out.println("To: " + request.getToEmail());
            System.out.println("Subject: Test Email");
            System.out.println("Body: Ceci est un email de test");
            
            emailService.sendEvaluationLink(
                request.getToEmail(),
                "Test User",
                "Test Formulaire",
                "test-token-123"
            );
            
            return ResponseEntity.ok("Email de test envoyé avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'envoi de l'email de test: " + e.getMessage());
        }
    }
    
    public static class TestEmailRequest {
        private String toEmail;
        
        public String getToEmail() { return toEmail; }
        public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    }
}
