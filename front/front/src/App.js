import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Accueil from "./pages/Accueil";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Compte from "./pages/Compte";
import AddFormulaire from './pages/AddFormulaire';
import Dashboard from './pages/Dashboard';
import Formulaires from './pages/Formulaires';
import FormulairesPublics from './pages/FormulairesPublics';
import Evaluation from './pages/Evaluation';
import Questions from './pages/Questions';
import EvaluationPublic from './pages/EvaluationPublic';
import Etudiants from './pages/Etudiants';
import Statistics from './pages/Statistics';
import './App.css';
 

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("userEmail"));
  

  useEffect(() => {
    const handler = () => {
      const email = localStorage.getItem("userEmail");
      setIsAuthenticated(!!email);
    };
    window.addEventListener('auth-changed', handler);
    handler();
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  const ProtectedRoute = ({ element: Element }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    return <Element collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />;
  };

  const AdminProtectedRoute = ({ element: Element }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') return <Navigate to="/accueil" />;
    return <Element collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />;
  };

  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Routes protégées */}
          <Route path="/accueil" element={<ProtectedRoute element={Accueil} />} />
          <Route path="/compte" element={<ProtectedRoute element={Compte} />} />
          <Route path="/dashboard" element={<AdminProtectedRoute element={Dashboard} />} />
          <Route path="/statistics" element={<AdminProtectedRoute element={Statistics} />} />
          <Route path="/formulaires/add" element={<AdminProtectedRoute element={AddFormulaire} />} />
          <Route path="/formulaires" element={<ProtectedRoute element={FormulairesPublics} />} />
          <Route path="/evaluation/:formId" element={<ProtectedRoute element={Evaluation} />} />
          <Route path="/admin/formulaires" element={<AdminProtectedRoute element={Formulaires} />} />
          <Route path="/questions/:formId" element={<AdminProtectedRoute element={Questions} />} />
          <Route path="/etudiants" element={<AdminProtectedRoute element={Etudiants} />} />
          <Route path="/formulaire/:token" element={<EvaluationPublic />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;