import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaCog,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import { getFormulaires, getGlobalStatistics, getEtudiants } from '../api';
import './Accueil.css';

function Accueil() {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ totalForms: 0, totalResponses: 0, totalEvaluators: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // Charger les statistiques réelles
    const loadStats = async () => {
      try {
        const [formsRes, statsRes, etudiantsRes] = await Promise.all([
          getFormulaires().catch(() => ({ data: [] })),
          getGlobalStatistics().catch(() => ({ data: {} })),
          getEtudiants().catch(() => ({ data: [] }))
        ]);
        
        setStats({
          totalForms: formsRes.data?.length || 0,
          totalResponses: statsRes.data?.totalResponses || 0,
          totalEvaluators: etudiantsRes.data?.length || 0
        });
      } catch (err) {
        console.error("Erreur chargement stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const slides = [
    {
      title: "Bienvenue sur Espritform",
      subtitle: "Plateforme d'évaluation",
      description: "Découvrez notre système d'évaluation moderne et efficace",
      bgColor: "#d32f2f"
    },
    {
      title: "Gestion des Formulaires",
      subtitle: "Créez et gérez vos évaluations",
      description: "Système complet de création et gestion de formulaires d'évaluation",
      bgColor: "#c62828"
    },
    {
      title: "Votre Espace de Travail",
      subtitle: "Accédez à vos outils",
      description: "Gérez facilement vos évaluations et suivez vos progrès",
      bgColor: "#b71c1c"
    }
  ];

  const features = [
    {
      icon: <FaClipboardList size={28} />,
      title: "Formulaires",
      description: "Créez et gérez vos formulaires d'évaluation",
      action: () => navigate("/admin/formulaires"),
      color: "#d32f2f",
      adminOnly: true
    },
    {
      icon: <FaChartBar size={28} />,
      title: "Statistiques",
      description: "Consultez les résultats et analyses détaillées",
      action: () => navigate("/statistics"),
      color: "#1976d2",
      adminOnly: true
    },
    {
      icon: <FaFileAlt size={28} />,
      title: "Mes Formulaires",
      description: "Accédez à vos formulaires disponibles",
      action: () => navigate("/formulaires"),
      color: "#388e3c",
      adminOnly: false
    },
    {
      icon: <FaUsers size={28} />,
      title: "Évaluateurs",
      description: "Gérez les accès des évaluateurs",
      action: () => navigate("/etudiants"),
      color: "#f57c00",
      adminOnly: true
    },
    {
      icon: <FaChartLine size={28} />,
      title: "Dashboard",
      description: "Tableau de bord complet",
      action: () => navigate("/dashboard"),
      color: "#7b1fa2",
      adminOnly: true
    },
    {
      icon: <FaCog size={28} />,
      title: "Mon Compte",
      description: "Gérez vos informations personnelles",
      action: () => navigate("/compte"),
      color: "#455a64",
      adminOnly: false
    }
  ].filter(f => !f.adminOnly || userRole === 'admin');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} />

      <button
        className="toggle-btn"
        style={{
          position: "fixed",
          top: "10px",
          left: collapsed ? "70px" : "240px",
          zIndex: 1001,
          background: "#d32f2f",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "left 0.3s ease",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "»" : "«"}
      </button>

      <motion.main
        className="home-container"
        style={{ marginLeft: collapsed ? "70px" : "240px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Banner avec carousel */}
        <div className="hero-banner">
          <button className="carousel-btn prev" onClick={prevSlide}>
            <FaArrowLeft />
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <FaArrowRight />
          </button>
          
          <motion.div
            key={currentSlide}
            className="hero-slide"
            style={{ backgroundColor: slides[currentSlide].bgColor }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-content">
              <motion.h1
                className="hero-title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.p
                className="hero-description"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>
          </motion.div>
          
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-overview">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ffebee' }}>
              <FaClipboardList style={{ color: '#d32f2f', fontSize: '2rem' }} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.totalForms}</h3>
              <p>Formulaires actifs</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#e3f2fd' }}>
              <FaFileAlt style={{ color: '#1976d2', fontSize: '2rem' }} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.totalResponses}</h3>
              <p>Évaluations complétées</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff3e0' }}>
              <FaUsers style={{ color: '#f57c00', fontSize: '2rem' }} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.totalEvaluators}</h3>
              <p>Évaluateurs</p>
            </div>
          </motion.div>
        </div>

        {/* Grille de fonctionnalités */}
        <div className="features-section">
          <h2 className="section-title">Fonctionnalités</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                onClick={feature.action}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ borderTopColor: feature.color }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-arrow">
                  <FaArrowRight style={{ color: feature.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer ESPRIT */}
        <motion.footer
          className="app-footer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="footer-content">
            <div className="footer-brand">
              <h3>ESPRIT</h3>
              <p className="tagline">Se former autrement</p>
              <p className="university">HONORIS UNITED UNIVERSITIES</p>
            </div>
            <div className="footer-links">
              <p>© {new Date().getFullYear()} <strong>Espritform</strong> – Tous droits réservés.</p>
              <p className="small">
                <a href="mailto:contact@espriteval.tn">Contactez-nous</a>
              </p>
            </div>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}

export default Accueil;
