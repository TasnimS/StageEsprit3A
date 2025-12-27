import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { accessFormByToken, submitAnswersByToken } from "../api";

function EvaluationPublic() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formulaire, setFormulaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [evaluatorId, setEvaluatorId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await accessFormByToken(token);
      setFormulaire(res.data.formulaire);
      setQuestions(res.data.questions);
      
      // Extraire l'evaluatorId du token JWT si disponible
      if (res.data.evaluatorId) {
        setEvaluatorId(res.data.evaluatorId);
      }
      
      setError(null);
    } catch (err) {
      setError("Lien invalide ou expiré.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAnswersByToken(token, {
        commentaire: responses.commentaire || "",
        idUtilisateur: null, // public/anonymous
        evaluatorId: evaluatorId, // ID de l'évaluateur
        questionAnswers: Object.fromEntries(
          Object.entries(responses).filter(([k]) => k !== "commentaire")
        ),
      });
      alert("Merci pour votre réponse !");
      navigate("/");
    } catch (err) {
      setError("Erreur lors de l'envoi de vos réponses.");
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
        <button onClick={() => navigate("/")}>
          Retour à l'accueil
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
        </div>
      </div>

      <div className="evaluation-form-container">
        <form onSubmit={handleSubmit} className="evaluation-form">
          {questions.map((q, idx) => (
            <div key={q.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
                <span className="question-score">Barème: {q.bareme} point(s)</span>
              </div>
              <div className="question-content">
                <h3 className="question-text">{q.libelle}</h3>
                <textarea
                  placeholder="Votre réponse..."
                  value={responses[q.id] || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  required
                  rows={4}
                  className="response-textarea"
                />
              </div>
            </div>
          ))}

          <div className="comment-section">
            <h3>Commentaires généraux (optionnel)</h3>
            <textarea
              placeholder="Ajoutez vos commentaires généraux sur cette évaluation..."
              value={responses.commentaire || ""}
              onChange={(e) => handleInputChange("commentaire", e.target.value)}
              rows={3}
              className="comment-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
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

        .evaluation-error h2 {
          color: #ff0000;
          margin-bottom: 1rem;
        }

        .evaluation-error button {
          background: #ff0000;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .evaluation-header {
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

        .response-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
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
          box-sizing: border-box;
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
          .evaluation-container {
            padding: 1rem;
          }

          .evaluation-header {
            padding: 1.5rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default EvaluationPublic;
