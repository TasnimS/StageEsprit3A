import React, { useState, useEffect } from 'react';
import { getEtudiants, listLinksByForm, sendEvaluationLink, debugSendLink } from '../api';
import './SendEmailModal.css';

const SendEmailModal = ({ isOpen, onClose, formId, formTitle }) => {
  const [etudiants, setEtudiants] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState('');
  const [selectedLink, setSelectedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && formId) {
      fetchData();
    }
  }, [isOpen, formId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [etudiantsRes, linksRes] = await Promise.all([
        getEtudiants(),
        listLinksByForm(formId)
      ]);
      setEtudiants(etudiantsRes.data);
      setLinks(linksRes.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEvaluator || !selectedLink) {
      setError('Veuillez sélectionner un évaluateur et un lien');
      return;
    }

    console.log('=== SEND EMAIL DEBUG ===');
    console.log('FormId:', formId);
    console.log('SelectedEvaluator:', selectedEvaluator);
    console.log('SelectedLink:', selectedLink);
    console.log('FormTitle:', formTitle);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Test avec l'endpoint de debug d'abord
      console.log('Sending debug request...');
      const debugResponse = await debugSendLink(formId, selectedEvaluator, selectedLink);
      console.log('Debug response:', debugResponse.data);
      
      // Si le debug fonctionne, on essaie l'endpoint réel
      await sendEvaluationLink(formId, selectedEvaluator, selectedLink);
      setSuccess('Email envoyé avec succès!');
      setSelectedEvaluator('');
      setSelectedLink('');
    } catch (err) {
      console.error('Email sending error:', err);
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      if (err.response?.data) {
        errorMessage += ': ' + err.response.data;
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      } else if (typeof err === 'string') {
        errorMessage += ': ' + err;
      } else {
        errorMessage += ': Erreur inconnue';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Envoyer un lien d'évaluation</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="form-info">
            <h3>Formulaire: {formTitle}</h3>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="evaluator">Sélectionner un évaluateur:</label>
            <select
              id="evaluator"
              value={selectedEvaluator}
              onChange={(e) => setSelectedEvaluator(e.target.value)}
              disabled={loading}
            >
              <option key="default-evaluator" value="">Choisir un évaluateur...</option>
              {etudiants.map((etudiant) => (
                <option key={etudiant.id} value={etudiant.id}>
                  {etudiant.nom} ({etudiant.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="link">Sélectionner un lien:</label>
            <select
              id="link"
              value={selectedLink}
              onChange={(e) => setSelectedLink(e.target.value)}
              disabled={loading}
            >
              <option key="default-link" value="">Choisir un lien...</option>
              {links.map((link) => (
                <option key={link.token} value={link.token}>
                  Lien créé le {new Date(link.createdAt).toLocaleDateString()} 
                  (Expire le {new Date(link.expiration).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {etudiants.length === 0 && (
            <div className="warning-message">
              Aucun évaluateur trouvé. Veuillez d'abord ajouter des évaluateurs.
            </div>
          )}

          {links.length === 0 && (
            <div className="warning-message">
              Aucun lien généré pour ce formulaire. Veuillez d'abord générer un lien.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            className="btn-send" 
            onClick={handleSendEmail}
            disabled={loading || !selectedEvaluator || !selectedLink}
          >
            {loading ? 'Envoi...' : 'Envoyer l\'email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
