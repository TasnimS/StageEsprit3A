import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormulaires } from "../api";

function FormulairesPublics() {
  const [formulaires, setFormulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all available forms
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

  // Handle form selection
  const handleFormClick = (formId) => {
    navigate(`/evaluation/${formId}`);
  };

  return (
    <div className="formulaires-publics-container">
      <div className="formulaires-publics-header">
        <h1>Formulaires d'Évaluation</h1>
        <p>Sélectionnez un formulaire pour commencer l'évaluation</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement des formulaires...</div>
      ) : (
        <div className="formulaires-grid">
          {formulaires.map((form) => (
            <div 
              key={form.id} 
              className="form-card"
              onClick={() => handleFormClick(form.id)}
            >
              <div className="form-card-header">
                <h3>{form.titre}</h3>
                <span className="form-level">{form.niveau}</span>
              </div>
              <div className="form-card-content">
                <p className="form-description">
                  {form.description || "Aucune description disponible"}
                </p>
                <div className="form-meta">
                  <span className="form-status">
                    {form.statut ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
              <div className="form-card-footer">
                <button className="btn-start-evaluation">
                  Commencer l'évaluation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .formulaires-publics-container {
          padding: 2rem;
          background-color: #f9f9f9;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .formulaires-publics-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .formulaires-publics-header h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .formulaires-publics-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .error-message {
          background: #ff6b6b;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #666;
          font-size: 1.1rem;
        }

        .formulaires-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          border-color: #ff0000;
        }

        .form-card-header {
          background: linear-gradient(135deg, #ff0000, #d40000);
          color: white;
          padding: 1.5rem;
          position: relative;
        }

        .form-card-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .form-level {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .form-card-content {
          padding: 1.5rem;
        }

        .form-description {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .form-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          background: #d4edda;
          color: #155724;
        }

        .form-card-footer {
          padding: 1.5rem;
          background: #f8f9fa;
          text-align: center;
        }

        .btn-start-evaluation {
          background: #ff0000;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.3s ease;
          width: 100%;
        }

        .btn-start-evaluation:hover {
          background: #d40000;
        }

        @media (max-width: 768px) {
          .formulaires-grid {
            grid-template-columns: 1fr;
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FormulairesPublics; 