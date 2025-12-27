package com.example.SujetStage.services;

import com.example.SujetStage.entities.LienEvaluation;
import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.repositories.LienEvaluationRepository;
import com.example.SujetStage.repositories.FormulaireRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Service
public class LienEvaluationService {

    private final LienEvaluationRepository lienEvaluationRepository;
    private final FormulaireRepository formulaireRepository;
    private final SecretKey jwtSecretKey;

    public LienEvaluationService(LienEvaluationRepository lienEvaluationRepository,
                                 FormulaireRepository formulaireRepository,
                                 @Value("${app.jwt-secret}") String jwtSecret) {
        this.lienEvaluationRepository = lienEvaluationRepository;
        this.formulaireRepository = formulaireRepository;
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(int formId, String evaluatorEmail, Long evaluatorId, int expirationHours) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expirationHours, ChronoUnit.HOURS);

        String token = Jwts.builder()
                .claim("formId", formId)
                .claim("evaluatorEmail", evaluatorEmail)
                .claim("evaluatorId", evaluatorId)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();

        LienEvaluation lien = new LienEvaluation();
        lien.setIdFormulaire(formId);
        lien.setToken(token);
        lien.setExpiration(expiry);
        lienEvaluationRepository.save(lien);

        return token;
    }

    public Optional<LienEvaluation> findByToken(String token) {
        return lienEvaluationRepository.findByToken(token);
    }

    public java.util.List<LienEvaluation> findByFormId(int formId) {
        return lienEvaluationRepository.findByIdFormulaire(formId);
    }
}


