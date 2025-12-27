import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFormulaireById,
  getQuestionsByFormulaire,
  addReponseFormulaire,
  addReponseQuestion
} from "../api";

function Evaluation() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formulaire, setFormulaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch form details and questions
  const fetchFormData = async () => {
    setLoading(true);
    try {
      const [formRes, questionsRes] = await Promise.all([
        getFormulaireById(formId),
        getQuestionsByFormulaire(formId)
      ]);
      setFormulaire(formRes.data);
      setQuestions(questionsRes.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement du formulaire.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFormData();
  }, [formId]);

  // Handle input change
  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create form response
      const formResponse = {
        commentaire: responses.commentaire || "",
        noteGlobal: 0, // Will be calculated based on answers
        idUtilisateur: 1, // Placeholder - should come from authentication
        idFormulaire: parseInt(formId)
      };

      const formResponseRes = await addReponseFormulaire(formResponse);
      const formResponseId = formResponseRes.data.id;

      // Create question responses
      const questionPromises = questions.map(question => {
        const response = responses[question.id];
        if (response) {
          return addReponseQuestion({
            valeur: response,
            idQuestion: question.id
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(questionPromises);

      // Show success and redirect
      alert("Évaluation soumise avec succès !");
      navigate("/formulaires");
    } catch (err) {
      setError("Erreur lors de la soumission de l'évaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="evaluation-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du formulaire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluation-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/formulaires")}>
          Retour aux formulaires
        </button>
      </div>
    );
  }

  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <div className="header-content">
          <h1>{formulaire?.titre}</h1>
          <p className="form-description">{formulaire?.description}</p>
          <div className="form-meta">
            <span className="form-level">Niveau: {formulaire?.niveau}</span>
            <span className="questions-count">{questions.length} question(s)</span>
          </div>
        </div>
        <button 
          onClick={() => navigate("/formulaires")}
          className="btn-back"
        >
          ← Retour
        </button>
      </div>

      <div className="evaluation-form-container">
        <form onSubmit={handleSubmit} className="evaluation-form">
          {questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className="question-score">Barème: {question.bareme} point(s)</span>
              </div>
              <div className="question-content">
                <h3 className="question-text">{question.libelle}</h3>
                <div className="question-input">
                  <textarea
                    placeholder="Votre réponse..."
                    value={responses[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    required
                    rows={4}
                    className="response-textarea"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="comment-section">
            <h3>Commentaires généraux (optionnel)</h3>
            <textarea
              placeholder="Ajoutez vos commentaires généraux sur cette évaluation..."
              value={responses.commentaire || ""}
              onChange={(e) => handleInputChange('commentaire', e.target.value)}
              rows={3}
              className="comment-textarea"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? "Soumission en cours..." : "Soumettre l'évaluation"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .evaluation-container {
          padding: 2rem;
          background-color: #f9f9f9;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .evaluation-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ff0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .evaluation-error {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .evaluation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .header-content h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .form-description {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .form-meta {
          display: flex;
          gap: 1rem;
        }

        .form-level, .questions-count {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          background: #e9ecef;
          color: #495057;
        }

        .btn-back {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .btn-back:hover {
          background: #5a6268;
        }

        .evaluation-form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .evaluation-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .question-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .question-header {
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e9ecef;
        }

        .question-number {
          font-weight: 600;
          color: #1a1a1a;
        }

        .question-score {
          background: #ff0000;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .question-content {
          padding: 1.5rem;
        }

        .question-text {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .question-input {
          width: 100%;
        }

        .response-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }

        .response-textarea:focus {
          outline: none;
          border-color: #ff0000;
          box-shadow: 0 0 0 2px rgba(255,0,0,0.1);
        }

        .comment-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .comment-section h3 {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
        }

        .comment-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }

        .comment-textarea:focus {
          outline: none;
          border-color: #ff0000;
          box-shadow: 0 0 0 2px rgba(255,0,0,0.1);
        }

        .form-actions {
          text-align: center;
          padding: 2rem 0;
        }

        .btn-submit {
          background: #ff0000;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.3s ease;
          min-width: 200px;
        }

        .btn-submit:hover:not(:disabled) {
          background: #d40000;
        }

        .btn-submit:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .evaluation-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .form-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Evaluation; 