import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import "./AddFormulaire.css";

function AddFormulaire({ collapsed, onToggleCollapse }) {
  const [formulaire, setFormulaire] = useState({
    titre: "",
    description: "",
    niveau: "",
    idClasse: "",
    idCreateur: 1, // par défaut, à adapter selon utilisateur connecté
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pour les champs numériques, on accepte que des nombres ou vide (string "")
    if (["idClasse", "idCreateur"].includes(name)) {
      // Autoriser vide ou nombre
      if (value === "") {
        setFormulaire({ ...formulaire, [name]: "" });
      } else if (/^\d+$/.test(value)) {
        setFormulaire({ ...formulaire, [name]: parseInt(value, 10) });
      }
      // Ignorer si autre chose (ex: lettres)
    } else {
      setFormulaire({ ...formulaire, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple avant envoi
    if (!formulaire.titre || !formulaire.niveau || formulaire.idClasse === "") {
      alert("Merci de remplir tous les champs obligatoires !");
      return;
    }

    // Préparer payload avec conversion en nombres correctes
    const payload = {
      ...formulaire,
      idClasse: Number(formulaire.idClasse),
      idCreateur: Number(formulaire.idCreateur) || 1,
    };

    axios.post("http://localhost:8081/api/formulaires/add", payload)
      .then(() => {
        alert("Formulaire ajouté avec succès !");
        navigate("/formulaires");
      })
      .catch((err) => {
        console.error("Erreur ajout :", err);

        // Afficher message serveur si possible
        if (err.response && err.response.data) {
          alert("Erreur lors de l'ajout du formulaire : " + JSON.stringify(err.response.data));
        } else {
          alert("Erreur lors de l'ajout du formulaire : " + err.message);
        }
      });
  };

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      <main className="formulaire-container" style={{ marginLeft: collapsed ? "70px" : "240px" }}>
        <h2>Ajouter un Formulaire</h2>
        <form className="formulaire-form" onSubmit={handleSubmit}>
          <label>Titre :</label>
          <input
            type="text"
            name="titre"
            value={formulaire.titre}
            onChange={handleChange}
            required
          />

          <label>Description :</label>
          <textarea
            name="description"
            value={formulaire.description}
            onChange={handleChange}
          />

          <label>Niveau :</label>
          <select
            name="niveau"
            value={formulaire.niveau}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="Master">Master</option>
          </select>

          <label>ID Classe :</label>
          <input
            type="number"
            name="idClasse"
            value={formulaire.idClasse}
            onChange={handleChange}
            required
            min="1"
          />

          <button type="submit" className="btn-submit">
            Ajouter
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddFormulaire;
