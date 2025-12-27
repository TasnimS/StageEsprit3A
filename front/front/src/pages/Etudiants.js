import React, { useEffect, useState } from "react";
import { getEtudiants, createEtudiant, updateEtudiant, deleteEtudiant } from "../api";
import EmailTestModal from "../components/EmailTestModal";
import "./Etudiants.css";

function Etudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    idClasse: 1,
  });
  const [editId, setEditId] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);

  // Fetch all evaluators
  const fetchEtudiants = async () => {
    setLoading(true);
    try {
      const res = await getEtudiants();
      setEtudiants(res.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des évaluateurs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEtudiants();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateEtudiant(editId, form);
      } else {
        await createEtudiant(form);
      }
      setForm({ nom: "", email: "", idClasse: 1 });
      setEditId(null);
      fetchEtudiants();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'évaluateur.");
    }
  };

  // Handle edit
  const handleEdit = (etudiant) => {
    setForm({
      nom: etudiant.nom,
      email: etudiant.email,
      idClasse: etudiant.idClasse,
    });
    setEditId(etudiant.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet évaluateur ?")) {
      try {
        await deleteEtudiant(id);
        fetchEtudiants();
      } catch (err) {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="etudiants-container">
      <div className="etudiants-header">
        <h1>Gestion des Évaluateurs</h1>
        <p>Ajoutez et gérez les évaluateurs qui peuvent recevoir des liens d'évaluation</p>
        <button 
          onClick={() => setShowTestModal(true)}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Email Configuration
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add/Edit Form */}
      <div className="form-card">
        <h3>{editId ? "Modifier l'Évaluateur" : "Ajouter un Évaluateur"}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <input
              type="text"
              name="nom"
              placeholder="Nom de l'évaluateur"
              value={form.nom}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email de l'évaluateur"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="idClasse"
              placeholder="ID Classe"
              value={form.idClasse}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn-submit">
              {editId ? "Modifier" : "Ajouter"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ nom: "", email: "", idClasse: 1 });
                  setEditId(null);
                }}
                className="btn-cancel"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="list-card">
        <h3>Liste des Évaluateurs</h3>
        {loading ? (
          <div className="loading">Chargement des évaluateurs...</div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>ID Classe</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etudiant) => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.id}</td>
                    <td>{etudiant.nom}</td>
                    <td>{etudiant.email}</td>
                    <td>{etudiant.idClasse}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(etudiant)} className="btn-edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(etudiant.id)} className="btn-delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                 )}
       </div>
       
       {/* Email Test Modal */}
       <EmailTestModal
         isOpen={showTestModal}
         onClose={() => setShowTestModal(false)}
       />
     </div>
   );
 }

export default Etudiants;
