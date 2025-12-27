import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, password, role }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const message = await response.text();
        setError(message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#121212",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "450px",
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(255, 0, 0, 0.3)"
      }}>
        <h2 style={{
          color: "red",
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "1.8rem"
        }}>Créer un compte</h2>

        {error && (
          <div style={{
            backgroundColor: "#550000",
            color: "white",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #ff0000"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Nom complet</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom complet"
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #444",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: utilisateur@esprit.tn"
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #444",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #444",
                borderRadius: "5px",
                boxSizing: "border-box",
                appearance: "none"
              }}
            >
              <option value="admin">Administrateur</option>
              <option value="evaluateur">Évaluateur</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #444",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="******"
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #444",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s",
              marginBottom: "20px"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#cc0000"}
            onMouseOut={(e) => e.target.style.backgroundColor = "red"}
          >
            S'inscrire
          </button>

          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#aaa" }}>Déjà un compte ? </span>
            <a href="/login" style={{
              color: "red",
              textDecoration: "none",
              fontWeight: "500"
            }}>
              Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

