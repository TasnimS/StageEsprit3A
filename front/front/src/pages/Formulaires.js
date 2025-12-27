import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFormulaires,
  addFormulaire,
  updateFormulaire,
  deleteFormulaire,
  generateEvaluationLink,
  listLinksByForm,
} from "../api";
import SendEmailModal from "../components/SendEmailModal";
import EmailTestModal from "../components/EmailTestModal";

function Formulaires() {
  const [formulaires, setFormulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    niveau: "",
    idCreateur: 1, // Placeholder, adjust as needed
    idClasse: 1,   // Placeholder, adjust as needed
    statut: true,
  });
  const [editId, setEditId] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailTestModal, setShowEmailTestModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const navigate = useNavigate();

  // Fetch all forms
  const fetchFormulaires = async () => {
    setLoading(true);
    try {
      const res = await getFormulaires();
      setFormulaires(res.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des formulaires.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFormulaires();
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
        await updateFormulaire(editId, form);
      } else {
        await addFormulaire(form);
      }
      setForm({ titre: "", description: "", niveau: "", idCreateur: 1, idClasse: 1, statut: true });
      setEditId(null);
      fetchFormulaires();
    } catch (err) {
      setError("Erreur lors de l'enregistrement du formulaire.");
    }
  };

  // Handle edit
  const handleEdit = (f) => {
    setForm({
      titre: f.titre,
      description: f.description,
      niveau: f.niveau,
      idCreateur: f.idCreateur,
      idClasse: f.idClasse,
      statut: f.statut,
    });
    setEditId(f.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce formulaire ?")) {
      try {
        await deleteFormulaire(id);
        fetchFormulaires();
      } catch (err) {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  // Handle navigate to questions
  const handleQuestions = (formId) => {
    navigate(`/questions/${formId}`);
  };

  // Generate secure evaluation link
  const handleGenerateLink = async (formId) => {
    try {
      const res = await generateEvaluationLink(formId);
      const { url } = res.data;
      await navigator.clipboard.writeText(url);
      alert(`Lien généré et copié:\n${url}`);
    } catch (err) {
      alert("Erreur lors de la génération du lien");
    }
  };

  const handleViewLinks = async (formId) => {
    try {
      const res = await listLinksByForm(formId);
      const lines = res.data.map(l => `${new Date(l.createdAt).toLocaleString()} | exp: ${new Date(l.expiration).toLocaleString()}\n${l.url}`).join("\n\n");
      alert(lines || "Aucun lien généré");
    } catch (err) {
      alert("Erreur lors du chargement des liens");
    }
  };

  const handleSendEmail = (form) => {
    setSelectedForm(form);
    setShowEmailModal(true);
  };

  return (
    <div className="formulaires-container">
      <div className="formulaires-header">
        <h1>Gestion des Formulaires</h1>
        <p>Créez et gérez vos formulaires d'évaluation</p>
        <button 
          onClick={() => setShowEmailTestModal(true)}
          className="btn-test-email"
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          🧪 Test Email Configuration
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add/Edit Form */}
      <div className="form-card">
        <h3>{editId ? "Modifier le Formulaire" : "Ajouter un Formulaire"}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <input
              type="text"
              name="titre"
              placeholder="Titre du formulaire"
              value={form.titre}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="niveau"
              placeholder="Niveau (ex: L1, L2)"
              value={form.niveau}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="idCreateur"
              placeholder="ID Créateur"
              value={form.idCreateur}
              onChange={handleChange}
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
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editId ? "Modifier" : "Ajouter"}
            </button>
            {editId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditId(null); 
                  setForm({ titre: "", description: "", niveau: "", idCreateur: 1, idClasse: 1, statut: true }); 
                }} 
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Formulaires List */}
      <div className="list-card">
        <h3>Liste des Formulaires</h3>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Niveau</th>
                  <th>ID Créateur</th>
                  <th>ID Classe</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formulaires.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.titre}</td>
                    <td>{f.description}</td>
                    <td>{f.niveau}</td>
                    <td>{f.idCreateur}</td>
                    <td>{f.idClasse}</td>
                    <td>
                      <span className={`status ${f.statut ? 'active' : 'inactive'}`}>
                        {f.statut ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEdit(f)} className="btn-edit">
                        ✏️
                      </button>
                      <button onClick={() => handleQuestions(f.id)} className="btn-questions">
                        Questions
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="btn-delete">
                        🗑️
                      </button>
                      <button onClick={() => handleGenerateLink(f.id)} className="btn-questions">
                        Générer le lien
                      </button>
                      <button onClick={() => handleViewLinks(f.id)} className="btn-questions">
                        Voir les liens
                      </button>
                      <button onClick={() => handleSendEmail(f)} className="btn-questions">
                        Envoyer Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .formulaires-container {
          padding: 2rem;
          background-color: #f9f9f9;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .formulaires-header {
          margin-bottom: 2rem;
        }

        .formulaires-header h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .formulaires-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .error-message {
          background: #ff6b6b;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .form-card, .list-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          margin-bottom: 2rem;
        }

        .form-card h3, .list-card h3 {
          margin: 0 0 1.5rem 0;
          color: #1a1a1a;
          font-size: 1.3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff0000;
          box-shadow: 0 0 0 2px rgba(255,0,0,0.1);
        }

        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-primary {
          background: #ff0000;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .btn-primary:hover {
          background: #d40000;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .table-container {
          overflow-x: auto;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .modern-table th {
          background: #1a1a1a;
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
        }

        .modern-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .modern-table tr:hover {
          background: #f8f9fa;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status.active {
          background: #d4edda;
          color: #155724;
        }

        .status.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        .btn-edit {
          background: #3498db;
          color: white;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-questions {
          background: #6c5ce7;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.3s ease;
        }

        .btn-questions:hover {
          background: #5a4fcf;
        }

        .btn-edit:hover, .btn-delete:hover {
          transform: scale(1.1);
        }
      `}</style>
      
      {/* Send Email Modal */}
      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        formId={selectedForm?.id}
        formTitle={selectedForm?.titre}
      />
      
      {/* Email Test Modal */}
      <EmailTestModal
        isOpen={showEmailTestModal}
        onClose={() => setShowEmailTestModal(false)}
      />
    </div>
  );
}

export default Formulaires;
