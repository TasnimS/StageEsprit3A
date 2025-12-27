package com.example.SujetStage.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private int bareme;

    private float ponderation;

    private boolean statut = true;

    @Column(name = "id_formulaire")
    private int idFormulaire;

    // Constructors
    public Question() {}

    public Question(String libelle, int bareme, float ponderation, boolean statut, int idFormulaire) {
        this.libelle = libelle;
        this.bareme = bareme;
        this.ponderation = ponderation;
        this.statut = statut;
        this.idFormulaire = idFormulaire;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public int getBareme() {
        return bareme;
    }

    public void setBareme(int bareme) {
        this.bareme = bareme;
    }

    public float getPonderation() {
        return ponderation;
    }

    public void setPonderation(float ponderation) {
        this.ponderation = ponderation;
    }

    public boolean isStatut() {
        return statut;
    }

    public void setStatut(boolean statut) {
        this.statut = statut;
    }

    public int getIdFormulaire() {
        return idFormulaire;
    }

    public void setIdFormulaire(int idFormulaire) {
        this.idFormulaire = idFormulaire;
    }
}