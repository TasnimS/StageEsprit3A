import React, { useEffect, useMemo, useState } from "react";
import { FaClipboardList, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { listResponsesByForm, getFormulaires } from '../api';
import './Dashboard.css';

const Dashboard = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const [notAllowed, setNotAllowed] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Gate access for evaluators - only admins can access dashboard
    const userRole = localStorage.getItem('userRole') || '';
    if (userRole !== 'admin') {
      setNotAllowed(true);
      return;
    }
    // Load forms and default responses
    (async () => {
      const res = await getFormulaires();
      setForms(res.data);
      if (res.data.length) {
        setSelectedFormId(res.data[0].id);
        const r = await listResponsesByForm(res.data[0].id);
        setResponses(r.data);
      }
    })();
  }, []);

  const handleSelectForm = async (e) => {
    const formId = parseInt(e.target.value);
    setSelectedFormId(formId);
    const r = await listResponsesByForm(formId);
    setResponses(r.data);
  };

  const handleFormulairesClick = () => {
    navigate('/admin/formulaires');
  };

  const handleStatsClick = () => {
    navigate('/statistics');
  };

  if (notAllowed) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas l'autorisation d'accéder à ce dashboard. Seuls les administrateurs peuvent y accéder.</p>
          <button 
            onClick={() => navigate('/accueil')}
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Gestion des formulaires et évaluations</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <div className="stat-content">
            <h3>Formulaires</h3>
            <p>Gérer vos formulaires d'évaluation</p>
            <button className="stat-button" onClick={handleFormulairesClick}>
              Voir les formulaires
            </button>
          </div>
        </div>

        <div className="stat-card">
          <FaChartBar className="stat-icon" />
          <div className="stat-content">
            <h3>Statistiques</h3>
            <p>Consulter les résultats et analyses</p>
            <button className="stat-button" onClick={handleStatsClick}>
              Voir les statistiques
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-recent">
        <h2>Réponses des formulaires</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>Formulaire:</label>
          <select value={selectedFormId || ''} onChange={handleSelectForm}>
            {forms.map(f => (
              <option key={f.id} value={f.id}>{f.titre}</option>
            ))}
          </select>
        </div>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Evaluateur (email)</th>
                <th>Commentaire</th>
                <th>Note globale</th>
              </tr>
            </thead>
            <tbody>
              {responses.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.evaluatorEmail || 'Anonyme'}</td>
                  <td>{r.commentaire}</td>
                  <td>{r.noteGlobal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
