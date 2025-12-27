import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaClipboardList, FaUsers, FaPercentage, FaTrophy, FaChartLine } from 'react-icons/fa';
import { getGlobalStatistics, getAllFormsStatistics } from '../api';
import './Statistics.css';

const Statistics = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const [globalStats, setGlobalStats] = useState(null);
  const [formsStats, setFormsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || '';
    if (userRole !== 'admin') {
      setNotAllowed(true);
      return;
    }

    const fetchStatistics = async () => {
      try {
        const [globalRes, formsRes] = await Promise.all([
          getGlobalStatistics(),
          getAllFormsStatistics()
        ]);
        
        // Validate that we received proper data
        if (globalRes?.data && typeof globalRes.data === 'object' && !globalRes.data.error) {
          setGlobalStats(globalRes.data);
        } else {
          throw new Error('Invalid global statistics data');
        }
        
        if (formsRes?.data && Array.isArray(formsRes.data)) {
          setFormsStats(formsRes.data);
        } else {
          throw new Error('Invalid forms statistics data');
        }
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        let errorMessage = "Erreur lors du chargement des statistiques";
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (notAllowed) {
    return (
      <div className="statistics-container">
        <div className="statistics-header">
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas l'autorisation d'accéder à cette page. Seuls les administrateurs peuvent y accéder.</p>
          <button 
            onClick={() => navigate('/accueil')}
            className="btn-back"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="statistics-loading">Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-container">
        <div className="statistics-header">
          <h1>Erreur</h1>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-back"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h1>Statistiques des Évaluations</h1>
        <p>Vue d'ensemble des performances et résultats</p>
      </div>

      {/* Global Statistics Cards */}
      {globalStats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ffebee' }}>
              <FaClipboardList className="stat-icon" style={{ color: '#d32f2f' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{globalStats.totalForms || 0}</div>
              <div className="stat-label">Formulaires totaux</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#e3f2fd' }}>
              <FaUsers className="stat-icon" style={{ color: '#1976d2' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{globalStats.totalResponses || 0}</div>
              <div className="stat-label">Réponses totales</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff3e0' }}>
              <FaTrophy className="stat-icon" style={{ color: '#f57c00' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {globalStats.averageScore != null ? globalStats.averageScore.toFixed(2) : '0.00'}
              </div>
              <div className="stat-label">Note moyenne globale</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#e8f5e9' }}>
              <FaChartLine className="stat-icon" style={{ color: '#388e3c' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{globalStats.formsWithResponses || 0}</div>
              <div className="stat-label">Formulaires avec réponses</div>
            </div>
          </div>
        </div>
      )}

      {/* Forms Statistics Table */}
      <div className="forms-statistics-section">
        <h2>Statistiques par Formulaire</h2>
        {formsStats.length === 0 ? (
          <div className="no-data">Aucun formulaire disponible</div>
        ) : (
          <div className="table-container">
            <table className="statistics-table">
              <thead>
                <tr>
                  <th>Formulaire</th>
                  <th>Réponses</th>
                  <th>Liens envoyés</th>
                  <th>Taux de réponse</th>
                  <th>Note moyenne</th>
                </tr>
              </thead>
              <tbody>
                {formsStats.map((form) => (
                  <tr key={form.formId}>
                    <td className="form-title-cell">{form.formTitle}</td>
                    <td>{form.totalResponses}</td>
                    <td>{form.totalLinks}</td>
                    <td>
                      <span className="percentage-badge">
                        {form.responseRate != null ? form.responseRate.toFixed(1) : '0.0'}%
                      </span>
                    </td>
                    <td>
                      <span className="score-badge">
                        {form.averageScore != null ? form.averageScore.toFixed(2) : '0.00'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;

