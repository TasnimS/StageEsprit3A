import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:8081/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Gestion des erreurs HTTP
    if (!response.ok) {
      let errorMessage = "Erreur de connexion";
      
      // Essayez de récupérer un message d'erreur du serveur
      try {
        const errorData = await response.text();
        if (errorData && errorData.trim()) {
          // Essayer de parser comme JSON d'abord
          try {
            const jsonError = JSON.parse(errorData);
            errorMessage = jsonError.message || jsonError.error || errorData;
          } catch {
            // Si ce n'est pas du JSON, utiliser le texte directement
            errorMessage = errorData;
          }
        } else {
          // Si pas de message, utiliser les messages par défaut selon le status
          switch (response.status) {
            case 400:
              errorMessage = "Données invalides";
              break;
            case 401:
              errorMessage = "Email ou mot de passe incorrect";
              break;
            case 404:
              errorMessage = "Utilisateur non trouvé";
              break;
            case 500:
              errorMessage = "Erreur interne du serveur. Veuillez réessayer plus tard.";
              break;
            default:
              errorMessage = `Erreur ${response.status}`;
          }
        }
      } catch (textError) {
        // Si on ne peut pas lire l'erreur, utiliser un message par défaut
        switch (response.status) {
          case 401:
            errorMessage = "Email ou mot de passe incorrect";
            break;
          case 500:
            errorMessage = "Erreur interne du serveur. Veuillez réessayer plus tard.";
            break;
          default:
            errorMessage = `Erreur ${response.status}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Succès - parser la réponse JSON
    const data = await response.json();

    // Stockage des informations
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", data.role || "user");
    localStorage.setItem("userName", data.nom || "");

    navigate("/accueil", { replace: true });

  } catch (err) {
    console.error("Erreur détaillée:", err);
    setError(err.message);
  } finally {
    setIsLoading(false);
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
        }}>Connexion</h2>

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

        <form onSubmit={handleLogin}>
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
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <a href="/forgot-password" style={{ 
                color: "red", 
                fontSize: "0.85rem",
                textDecoration: "none"
              }}>
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: isLoading ? "#cc0000" : "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s",
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#cc0000")}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "red")}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#aaa" }}>Vous n'avez pas de compte ? </span>
          <a href="/register" style={{ 
            color: "red", 
            textDecoration: "none",
            fontWeight: "500"
          }}>
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
