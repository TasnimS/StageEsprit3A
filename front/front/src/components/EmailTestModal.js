import React, { useState } from 'react';
import { testEmailConfiguration } from '../api';
import './SendEmailModal.css';

const EmailTestModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTestEmail = async () => {
    if (!email) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await testEmailConfiguration(email);
      setSuccess('Email de test envoyé avec succès! Vérifiez votre boîte de réception.');
      setEmail('');
    } catch (err) {
      console.error('Test email error:', err);
      let errorMessage = 'Erreur lors de l\'envoi de l\'email de test';
      
      if (err.response?.data) {
        errorMessage += ': ' + err.response.data;
      } else if (err.message) {
        errorMessage += ': ' + err.message;
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
          <h2>Test d'envoi d'email</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p>Ce test enverra un email de test pour vérifier la configuration.</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="test-email">Adresse email de test:</label>
            <input
              type="email"
              id="test-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre-email@example.com"
              disabled={loading}
              className="form-input"
            />
          </div>
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
            onClick={handleTestEmail}
            disabled={loading || !email}
          >
            {loading ? 'Envoi...' : 'Envoyer Email de Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTestModal;

