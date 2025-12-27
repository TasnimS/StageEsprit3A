package com.example.SujetStage.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

@Service
public class EmailService {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.email.mode:simulation}")
    private String emailMode;

    private Session mailSession;

    public EmailService() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        this.mailSession = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("tasnimsdiri2001@gmail.com", "pbri ajrq xrxq ajfr");
            }
        });
    }

    public void sendEvaluationLink(String toEmail, String evaluatorName, String formTitle, String token) {
        try {
            String evaluationUrl = frontendUrl + "/formulaire/" + token;

            String emailBody = String.format(
                    "Bonjour %s,\n\n" +
                            "Vous avez été invité à compléter une évaluation.\n\n" +
                            "Formulaire: %s\n\n" +
                            "Veuillez cliquer sur le lien suivant pour accéder à l'évaluation:\n" +
                            "%s\n\n" +
                            "Ce lien est sécurisé et unique. Ne le partagez pas avec d'autres personnes.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe d'évaluation",
                    evaluatorName, formTitle, evaluationUrl
            );

            System.out.println("=== EMAIL ENVOI ===");
            System.out.println("Mode: " + emailMode);
            System.out.println("To: " + toEmail);
            System.out.println("Subject: Lien d'évaluation - " + formTitle);
            System.out.println("Body: " + emailBody);
            System.out.println("==================");

            if ("envoi".equals(emailMode)) {
                try {
                    Message message = new MimeMessage(mailSession);
                    message.setFrom(new InternetAddress("tasnimsdiri2001@gmail.com"));
                    message.setRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
                    message.setSubject("Lien d'évaluation - " + formTitle);
                    message.setText(emailBody);

                    new Thread(() -> {
                        try {
                            Transport.send(message);
                            System.out.println("✅ Email envoyé avec succès à: " + toEmail);
                        } catch (MessagingException e) {
                            System.err.println("❌ Échec de l'envoi d'email à " + toEmail);
                            e.printStackTrace();
                        }
                    }).start();

                } catch (MessagingException emailError) {
                    System.out.println("❌ Erreur lors de la création du message email: " + emailError.getMessage());
                    emailError.printStackTrace();
                }
            } else {
                System.out.println("📧 Mode simulation - Email affiché dans la console");
            }

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email: " + e.getMessage(), e);
        }
    }

    public void sendFormResponsesSummary(String toEmail, String formTitle, 
                                         java.util.List<FormResponseSummary> responses) {
        try {
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Bonjour,\n\n");
            emailBody.append("Résumé des réponses pour le formulaire: ").append(formTitle).append("\n\n");
            emailBody.append("═══════════════════════════════════════\n\n");

            if (responses == null || responses.isEmpty()) {
                emailBody.append("Aucune réponse disponible pour ce formulaire.\n");
            } else {
                emailBody.append("Nombre total de réponses: ").append(responses.size()).append("\n\n");
                
                for (int i = 0; i < responses.size(); i++) {
                    FormResponseSummary response = responses.get(i);
                    emailBody.append("─────────────────────────────────────\n");
                    emailBody.append("Réponse #").append(i + 1).append("\n");
                    if (response.getEvaluatorName() != null && !response.getEvaluatorName().isEmpty()) {
                        emailBody.append("Évaluateur: ").append(response.getEvaluatorName()).append("\n");
                    }
                    if (response.getEvaluatorEmail() != null && !response.getEvaluatorEmail().isEmpty()) {
                        emailBody.append("Email: ").append(response.getEvaluatorEmail()).append("\n");
                    }
                    emailBody.append("Note globale: ").append(String.format("%.2f", response.getNoteGlobal())).append("/").append(response.getNoteMax()).append("\n");
                    if (response.getDateSoumission() != null) {
                        emailBody.append("Date: ").append(response.getDateSoumission()).append("\n");
                    }
                    if (response.getCommentaire() != null && !response.getCommentaire().trim().isEmpty()) {
                        emailBody.append("Commentaire: ").append(response.getCommentaire()).append("\n");
                    }
                    emailBody.append("\n");
                    
                    if (response.getQuestionAnswers() != null && !response.getQuestionAnswers().isEmpty()) {
                        emailBody.append("Réponses aux questions:\n");
                        for (var entry : response.getQuestionAnswers().entrySet()) {
                            emailBody.append("  • ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
                        }
                    }
                    emailBody.append("\n");
                }
            }

            emailBody.append("═══════════════════════════════════════\n\n");
            emailBody.append("Cordialement,\n");
            emailBody.append("L'équipe d'évaluation");

            String subject = "Résumé des réponses - " + formTitle;

            System.out.println("=== EMAIL RÉSUMÉ RÉPONSES ===");
            System.out.println("Mode: " + emailMode);
            System.out.println("To: " + toEmail);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + emailBody.toString());
            System.out.println("=============================");

            if ("envoi".equals(emailMode)) {
                try {
                    Message message = new MimeMessage(mailSession);
                    message.setFrom(new InternetAddress("tasnimsdiri2001@gmail.com"));
                    message.setRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
                    message.setSubject(subject);
                    message.setText(emailBody.toString());

                    new Thread(() -> {
                        try {
                            Transport.send(message);
                            System.out.println("✅ Email de résumé envoyé avec succès à: " + toEmail);
                        } catch (MessagingException e) {
                            System.err.println("❌ Échec de l'envoi d'email à " + toEmail);
                            e.printStackTrace();
                        }
                    }).start();

                } catch (MessagingException emailError) {
                    System.out.println("❌ Erreur lors de la création du message email: " + emailError.getMessage());
                    emailError.printStackTrace();
                }
            } else {
                System.out.println("📧 Mode simulation - Email affiché dans la console");
            }

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email de résumé: " + e.getMessage(), e);
        }
    }

    // Classe pour résumer les réponses d'un formulaire
    public static class FormResponseSummary {
        private String evaluatorName;
        private String evaluatorEmail;
        private float noteGlobal;
        private float noteMax;
        private String commentaire;
        private String dateSoumission;
        private java.util.Map<String, String> questionAnswers; // Question -> Réponse

        public String getEvaluatorName() { return evaluatorName; }
        public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }

        public String getEvaluatorEmail() { return evaluatorEmail; }
        public void setEvaluatorEmail(String evaluatorEmail) { this.evaluatorEmail = evaluatorEmail; }

        public float getNoteGlobal() { return noteGlobal; }
        public void setNoteGlobal(float noteGlobal) { this.noteGlobal = noteGlobal; }

        public float getNoteMax() { return noteMax; }
        public void setNoteMax(float noteMax) { this.noteMax = noteMax; }

        public String getCommentaire() { return commentaire; }
        public void setCommentaire(String commentaire) { this.commentaire = commentaire; }

        public String getDateSoumission() { return dateSoumission; }
        public void setDateSoumission(String dateSoumission) { this.dateSoumission = dateSoumission; }

        public java.util.Map<String, String> getQuestionAnswers() { return questionAnswers; }
        public void setQuestionAnswers(java.util.Map<String, String> questionAnswers) { this.questionAnswers = questionAnswers; }
    }
}