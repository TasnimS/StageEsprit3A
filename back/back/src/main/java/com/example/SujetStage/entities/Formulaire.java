package com.example.SujetStage.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "formulaire")
public class Formulaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String titre;

    private String description;

    private boolean statut = true;

    private String niveau;

    @Column(name = "id_createur")
    private int idCreateur;

    @Column(name = "id_classe")
    private int idClasse;

    // Constructeurs
    public Formulaire() {}

    public Formulaire(String titre, String description, String niveau, int idCreateur, int idClasse) {
        this.titre = titre;
        this.description = description;
        this.niveau = niveau;
        this.idCreateur = idCreateur;
        this.idClasse = idClasse;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isStatut() {
        return statut;
    }

    public void setStatut(boolean statut) {
        this.statut = statut;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public int getIdCreateur() {
        return idCreateur;
    }

    public void setIdCreateur(int idCreateur) {
        this.idCreateur = idCreateur;
    }

    public int getIdClasse() {
        return idClasse;
    }

    public void setIdClasse(int idClasse) {
        this.idClasse = idClasse;
    }
}