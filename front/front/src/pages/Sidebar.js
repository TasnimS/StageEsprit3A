import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';
import espritLogo from '../assets/esprit.png';

const Sidebar = ({ collapsed }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    if (!email) return;
    axios.get(`http://localhost:8081/api/users/me`, { params: { email } })
      .then(response => setUser(response.data))
      .catch(error => console.error("Erreur utilisateur :", error));
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userNom');
      window.dispatchEvent(new Event('auth-changed'));
    } catch (e) {}
    navigate('/');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <img src={espritLogo} alt="Esprit Logo" className="logo-esprit" />

      <nav className="sidebar-nav">
        <div className="nav-top">
          <NavLink to="/accueil" className="sidebar-link" activeclassname="active">
            <FaHome className="sidebar-icon" /> {!collapsed && 'Accueil'}
          </NavLink>
          <NavLink to="/compte" className="sidebar-link" activeclassname="active">
            <FaUser className="sidebar-icon" /> {!collapsed && 'Mon Compte'}
          </NavLink>
          <NavLink to="/formulaires" className="sidebar-link" activeclassname="active">
            <FaClipboardList className="sidebar-icon" /> {!collapsed && 'Formulaires'}
          </NavLink>
          {userRole === 'admin' && (
            <NavLink to="/etudiants" className="sidebar-link" activeclassname="active">
              <FaUsers className="sidebar-icon" /> {!collapsed && 'Évaluateurs'}
            </NavLink>
          )}
        </div>

        <div className="nav-bottom">
          {userRole === 'admin' && (
            <NavLink to="/dashboard" className="sidebar-link" activeclassname="active">
              <FaTachometerAlt className="sidebar-icon" /> {!collapsed && 'Dashboard'}
            </NavLink>
          )}

          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" /> {!collapsed && 'Déconnexion'}
          </button>

          {user && (
            <div className="sidebar-profile">
              <img
                src={user.photo ? `data:image/jpeg;base64,${user.photo}` : '/default-user.png'}
                alt="Profil"
                className="profile-image"
              />
              {!collapsed && (
                <div>
                  <p className="profile-name">{user.nom}</p>
                  <p className="profile-role" style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                    {userRole === 'admin' ? 'Administrateur' : 'Évaluateur'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
