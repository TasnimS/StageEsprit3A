package com.example.SujetStage.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "etudiant")
public class Etudiant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "id_classe")
    private Long idClasse;
    
    // Constructors
    public Etudiant() {}
    
    public Etudiant(String nom, String email, Long idClasse) {
        this.nom = nom;
        this.email = email;
        this.idClasse = idClasse;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Long getIdClasse() {
        return idClasse;
    }
    
    public void setIdClasse(Long idClasse) {
        this.idClasse = idClasse;
    }
}

