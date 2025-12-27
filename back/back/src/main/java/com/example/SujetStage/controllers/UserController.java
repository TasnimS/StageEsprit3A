package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.User;
import com.example.SujetStage.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.SujetStage.entities.User;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public UserController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    // Enregistrement d’un nouvel utilisateur
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email déjà utilisé.");
        }

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setNom(userDto.getNom());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());

        userRepository.save(user);
        return ResponseEntity.ok("Utilisateur enregistré avec succès.");
    }

    // Connexion utilisateur
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    LoginResponse response = new LoginResponse();
                    response.setMessage("✅ Connexion réussie");
                    response.setEmail(user.getEmail());
                    response.setRole(user.getRole());
                    response.setNom(user.getNom());
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            System.err.println("Erreur login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Réinitialisation du mot de passe
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
    }

    // Mise à jour du profil utilisateur avec upload photo
    @PostMapping("/update-profile")
    public ResponseEntity<String> updateProfile(
            @RequestParam("email") String email,
            @RequestParam("nom") String nom,
            @RequestParam("adresse") String adresse,
            @RequestParam("identite") String identite,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
            }
            
            User user = userOpt.get();
            user.setNom(nom != null ? nom : "");
            user.setAdresse(adresse != null ? adresse : "");
            user.setIdentite(identite != null ? identite : "");

            if (photo != null && !photo.isEmpty()) {
                try {
                    byte[] photoBytes = photo.getBytes();
                    if (photoBytes != null && photoBytes.length > 0) {
                        user.setPhoto(photoBytes);
                        System.out.println("Photo sauvegardée, taille: " + photoBytes.length + " bytes");
                    }
                } catch (IOException e) {
                    System.err.println("Erreur lors du traitement de la photo: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors du traitement de la photo: " + e.getMessage());
                }
            }

            userRepository.save(user);
            System.out.println("Profil mis à jour avec succès pour: " + email);
            return ResponseEntity.ok("✅ Profil mis à jour avec succès.");
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour du profil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur: " + e.getMessage());
        }
    }

    // DTO d’inscription utilisateur
    public static class UserDto {
        private String email;
        private String nom;
        private String password;
        private String role;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // Classe pour requête login (à créer dans payload ou ici)
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // Classe pour requête reset password (à créer dans payload ou ici)
    public static class ResetPasswordRequest {
        private String email;
        private String newPassword;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    // Classe pour réponse login
    public static class LoginResponse {
        private String message;
        private String email;
        private String role;
        private String nom;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }
    }

    // DTO pour réponse utilisateur avec photo en base64
    public static class UserResponseDto {
        private Long id;
        private String nom;
        private String email;
        private String adresse;
        private String identite;
        private String role;
        private String photo; // Base64 encoded

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAdresse() { return adresse; }
        public void setAdresse(String adresse) { this.adresse = adresse; }

        public String getIdentite() { return identite; }
        public void setIdentite(String identite) { this.identite = identite; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getPhoto() { return photo; }
        public void setPhoto(String photo) { this.photo = photo; }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@RequestParam("email") String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            User user = userOpt.get();
            UserResponseDto dto = new UserResponseDto();
            dto.setId(user.getId());
            dto.setNom(user.getNom() != null ? user.getNom() : "");
            dto.setEmail(user.getEmail() != null ? user.getEmail() : "");
            try {
                dto.setAdresse(user.getAdresse() != null ? user.getAdresse() : "");
            } catch (Exception e) {
                dto.setAdresse("");
            }
            try {
                dto.setIdentite(user.getIdentite() != null ? user.getIdentite() : "");
            } catch (Exception e) {
                dto.setIdentite("");
            }
            dto.setRole(user.getRole() != null ? user.getRole() : "");
            try {
                if (user.getPhoto() != null && user.getPhoto().length > 0) {
                    dto.setPhoto(Base64.getEncoder().encodeToString(user.getPhoto()));
                }
            } catch (Exception e) {
                // Photo non disponible
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l'utilisateur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id,
                                             @RequestParam(value = "nom", required = false) String nom,
                                             @RequestParam(value = "adresse", required = false) String adresse,
                                             @RequestParam(value = "identite", required = false) String identite,
                                             @RequestParam(value = "photo", required = false) MultipartFile photo) {
        System.out.println("Update user called with ID: " + id);
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            System.out.println("User not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable avec l'ID: " + id);
        }
        
        User user = userOpt.get();
        System.out.println("Found user: " + user.getEmail());
        
        // Mettre à jour les champs seulement s'ils sont fournis et non vides
        if (nom != null) {
            user.setNom(nom.trim().isEmpty() ? null : nom.trim());
        }
        if (adresse != null) {
            user.setAdresse(adresse.trim().isEmpty() ? null : adresse.trim());
        }
        if (identite != null) {
            user.setIdentite(identite.trim().isEmpty() ? null : identite.trim());
        }
        
        if (photo != null && !photo.isEmpty()) {
            try {
                user.setPhoto(photo.getBytes());
                System.out.println("Photo updated");
            } catch (IOException e) {
                System.out.println("Error processing photo: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors du traitement de la photo.");
            }
        }

        userRepository.save(user);
        System.out.println("User updated successfully");
        return ResponseEntity.ok("✅ Profil mis à jour avec succès.");
    }
    
}
