import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuestionsByFormulaire,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getFormulaireById
} from "../api";

function Questions() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formulaire, setFormulaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState({
    libelle: "",
    bareme: 1,
    ponderation: 0.1,
    idFormulaire: parseInt(formId)
  });
  const [editId, setEditId] = useState(null);

  // Fetch questions for this form
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getQuestionsByFormulaire(formId);
      setQuestions(res.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des questions.");
    }
    setLoading(false);
  };

  // Fetch formulaire details
  const fetchFormulaire = async () => {
    try {
      const res = await getFormulaireById(formId);
      setFormulaire(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement du formulaire:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchFormulaire();
  }, [formId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  // Handle add or update question
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateQuestion(editId, question);
      } else {
        await addQuestion(question);
      }
      setQuestion({
        libelle: "",
        bareme: 1,
        ponderation: 0.1,
        idFormulaire: parseInt(formId)
      });
      setEditId(null);
      fetchQuestions();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la question.");
    }
  };

  // Handle edit question
  const handleEdit = (q) => {
    setQuestion({
      libelle: q.libelle,
      bareme: q.bareme,
      ponderation: q.ponderation,
      idFormulaire: parseInt(formId)
    });
    setEditId(q.id);
  };

  // Handle delete question
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette question ?")) {
      try {
        await deleteQuestion(id);
        fetchQuestions();
      } catch (err) {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="questions-container">
      <div className="questions-header">
        <div className="header-content">
          <h1>Gestion des Questions</h1>
          <p>{formulaire && `Formulaire: ${formulaire.titre}`}</p>
        </div>
                        <button
                  onClick={() => navigate("/admin/formulaires")}
                  className="btn-back"
                >
                  ← Retour aux Formulaires
                </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add Question Form */}
      <div className="form-card">
        <h3>{editId ? "Modifier la Question" : "Ajouter une Question"}</h3>
        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-row">
            <div className="form-group">
              <label>Libellé de la question</label>
              <input
                type="text"
                name="libelle"
                placeholder="Entrez le libellé de la question"
                value={question.libelle}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Barème</label>
              <input
                type="number"
                name="bareme"
                placeholder="Points"
                value={question.bareme}
                onChange={handleChange}
                required
                min="1"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Pondération</label>
              <input
                type="number"
                name="ponderation"
                placeholder="Poids"
                value={question.ponderation}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editId ? "Modifier la Question" : "AJOUTER LA QUESTION"}
            </button>
            {editId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditId(null); 
                  setQuestion({
                    libelle: "",
                    bareme: 1,
                    ponderation: 0.1,
                    idFormulaire: parseInt(formId)
                  }); 
                }} 
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Questions List */}
      <div className="list-card">
        <h3>Liste des Questions</h3>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Libellé</th>
                  <th>Barème</th>
                  <th>Pondération</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="question-text">{q.libelle}</td>
                    <td className="question-score">{q.bareme}</td>
                    <td className="question-weight">{q.ponderation}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(q)}
                        className="btn-edit"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="btn-delete"
                        title="Supprimer"
                      >
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

      <style>{`
        .questions-container {
          padding: 2rem;
          background-color: #f9f9f9;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .questions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .header-content h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .btn-back {
          background: #ff0000;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .btn-back:hover {
          background: #d40000;
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

        .question-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #1a1a1a;
          font-size: 0.9rem;
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
          font-weight: 500;
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

        .question-text {
          max-width: 400px;
          word-wrap: break-word;
        }

        .question-score, .question-weight {
          text-align: center;
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
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

        .btn-edit:hover, .btn-delete:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .questions-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Questions;
