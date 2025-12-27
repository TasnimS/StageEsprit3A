package com.example.SujetStage.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "reponse_question")
public class ReponseQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String valeur;

    @Column(name = "id_question")
    private int idQuestion;
    
    @Column(name = "id_reponse_formulaire")
    private Integer idReponseFormulaire;

    // Constructors
    public ReponseQuestion() {}

    public ReponseQuestion(String valeur, int idQuestion) {
        this.valeur = valeur;
        this.idQuestion = idQuestion;
    }
    
    public ReponseQuestion(String valeur, int idQuestion, Integer idReponseFormulaire) {
        this.valeur = valeur;
        this.idQuestion = idQuestion;
        this.idReponseFormulaire = idReponseFormulaire;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public int getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(int idQuestion) {
        this.idQuestion = idQuestion;
    }
    
    public Integer getIdReponseFormulaire() {
        return idReponseFormulaire;
    }
    
    public void setIdReponseFormulaire(Integer idReponseFormulaire) {
        this.idReponseFormulaire = idReponseFormulaire;
    }
} 