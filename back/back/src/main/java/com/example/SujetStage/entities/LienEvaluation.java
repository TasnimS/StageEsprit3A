package com.example.SujetStage.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "lien_evaluation")
public class LienEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_formulaire", nullable = false)
    private int idFormulaire;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(name = "expiration", nullable = false)
    private Instant expiration;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getIdFormulaire() { return idFormulaire; }
    public void setIdFormulaire(int idFormulaire) { this.idFormulaire = idFormulaire; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Instant getExpiration() { return expiration; }
    public void setExpiration(Instant expiration) { this.expiration = expiration; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


