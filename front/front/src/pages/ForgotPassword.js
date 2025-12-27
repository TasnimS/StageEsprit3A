import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!email || !newPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.text();
      
      if (response.ok) {
        setMessage(result);
        setError("");
      } else {
        setError(result || "Erreur lors de la réinitialisation");
        setMessage("");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      setMessage("");
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
        }}>Réinitialisation du mot de passe</h2>

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

        {message && (
          <div style={{
            backgroundColor: "#005500",
            color: "white",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #00ff00"
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div style={{ marginBottom: "25px" }}>
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

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <div style={{
              marginTop: "8px",
              color: "#aaa",
              fontSize: "0.85rem"
            }}>
              Le mot de passe doit contenir au moins 8 caractères
            </div>
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
            Réinitialiser le mot de passe
          </button>

          <div style={{ textAlign: "center" }}>
            <a href="/login" style={{
              color: "red",
              textDecoration: "none",
              fontWeight: "500"
            }}>
              Retour à la page de connexion
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;