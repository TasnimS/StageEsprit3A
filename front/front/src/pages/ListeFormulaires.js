import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./ListeFormulaires.css";

function ListeFormulaires({ collapsed, onToggleCollapse }) {
  const [formulaires, setFormulaires] = useState([]);
  const navigate = useNavigate();

  // Charger les formulaires
  useEffect(() => {
    fetchFormulaires();
  }, []);

  const fetchFormulaires = () => {
    axios.get("http://localhost:8081/api/formulaires")
      .then((res) => setFormulaires(res.data))
      .catch((err) => console.error("Erreur fetch :", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      axios.delete(`http://localhost:8081/api/formulaires/${id}`)
        .then(() => fetchFormulaires())
        .catch(err => console.error("Erreur delete :", err));
    }
  };

  const handleEdit = (id) => {
    navigate(`/formulaires/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/formulaires/add");
  };

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      <main className="home-container" style={{ marginLeft: collapsed ? "70px" : "240px" }}>
        <h2>Gestion des Formulaires</h2>
        <table className="formulaires-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Niveau</th>
              <th>Classe</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formulaires.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.titre}</td>
                <td>{f.niveau}</td>
                <td>{f.idClasse}</td>
                <td>{f.statut ? "Actif" : "Inactif"}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(f.id)}><FaEdit /></button>
                  <button className="btn delete" onClick={() => handleDelete(f.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn add-btn" onClick={handleAdd}>
          <FaPlus /> Ajouter un formulaire
        </button>
      </main>
    </div>
  );
}

export default ListeFormulaires;
