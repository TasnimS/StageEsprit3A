package com.example.SujetStage.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "reponse_formulaire")
public class ReponseFormulaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String commentaire;

    @Column(name = "note_global")
    private float noteGlobal;

    @Column(name = "id_utilisateur")
    private int idUtilisateur;

    @Column(name = "id_formulaire")
    private int idFormulaire;
    
    @Column(name = "evaluator_id")
    private Long evaluatorId;
    
    @Column(name = "date_soumission")
    private java.time.LocalDateTime dateSoumission;

    // Constructors
    public ReponseFormulaire() {}

    public ReponseFormulaire(String commentaire, float noteGlobal, int idUtilisateur, int idFormulaire) {
        this.commentaire = commentaire;
        this.noteGlobal = noteGlobal;
        this.idUtilisateur = idUtilisateur;
        this.idFormulaire = idFormulaire;
    }
    
    public ReponseFormulaire(String commentaire, float noteGlobal, int idUtilisateur, int idFormulaire, Long evaluatorId) {
        this.commentaire = commentaire;
        this.noteGlobal = noteGlobal;
        this.idUtilisateur = idUtilisateur;
        this.idFormulaire = idFormulaire;
        this.evaluatorId = evaluatorId;
        this.dateSoumission = java.time.LocalDateTime.now();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public float getNoteGlobal() {
        return noteGlobal;
    }

    public void setNoteGlobal(float noteGlobal) {
        this.noteGlobal = noteGlobal;
    }

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public int getIdFormulaire() {
        return idFormulaire;
    }

    public void setIdFormulaire(int idFormulaire) {
        this.idFormulaire = idFormulaire;
    }
    
    public Long getEvaluatorId() {
        return evaluatorId;
    }
    
    public void setEvaluatorId(Long evaluatorId) {
        this.evaluatorId = evaluatorId;
    }
    
    public java.time.LocalDateTime getDateSoumission() {
        return dateSoumission;
    }
    
    public void setDateSoumission(java.time.LocalDateTime dateSoumission) {
        this.dateSoumission = dateSoumission;
    }
} 