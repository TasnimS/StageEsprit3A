import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../api";
import "./Compte.css";

function Compte() {
  const [user, setUser] = useState({
    id: null,
    nom: "",
    adresse: "",
    identite: "",
    email: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setMessage({ type: "error", text: "Aucun utilisateur connecté. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }

        const res = await getCurrentUser(email);
        if (!res || !res.data) {
          setMessage({ type: "error", text: "Impossible de récupérer les données utilisateur. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }

        const userData = res.data;
        console.log("User data received:", userData); // Debug
        
        if (!userData || !userData.id) {
          setMessage({ type: "error", text: "Données utilisateur incomplètes. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }

        setUser({
          id: userData.id,
          nom: userData.nom || "",
          adresse: userData.adresse || "",
          identite: userData.identite || "",
          email: userData.email || "",
          photo: null,
        });
        
        if (userData.photo) {
          try {
            setPreview(`data:image/jpeg;base64,${userData.photo}`);
          } catch (photoErr) {
            console.error("Erreur lors du chargement de la photo:", photoErr);
          }
        }
      } catch (err) {
        console.error("Erreur chargement utilisateur:", err);
        let errorMessage = "Erreur lors du chargement des données";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Utilisateur non trouvé. Veuillez vous reconnecter.";
          } else if (err.response.status === 500) {
            errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
          } else if (err.response.data) {
            errorMessage = typeof err.response.data === 'string' 
              ? err.response.data 
              : "Erreur lors du chargement";
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        setMessage({ type: "error", text: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage({ type: "", text: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.id) {
      setMessage({ type: "error", text: "ID utilisateur manquant" });
      return;
    }

    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      // Utiliser l'endpoint update-profile qui fonctionne avec l'email
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setMessage({ type: "error", text: "Email utilisateur manquant" });
        setUpdating(false);
        return;
      }
      
      const formData = new FormData();
      formData.append("email", email);
      formData.append("nom", user.nom || "");
      formData.append("adresse", user.adresse || "");
      formData.append("identite", user.identite || "");
      if (user.photo) {
        formData.append("photo", user.photo);
      }

      console.log("Updating user with email:", email); // Debug
      console.log("FormData contents:", {
        email: email,
        nom: user.nom,
        adresse: user.adresse,
        identite: user.identite,
        hasPhoto: !!user.photo
      });
      
      const response = await axios.post('http://localhost:8081/api/users/update-profile', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Update response:", response); // Debug
      
      if (response && response.data) {
        setMessage({ type: "success", text: response.data || "✅ Profil mis à jour avec succès" });
      } else {
        setMessage({ type: "success", text: "✅ Profil mis à jour avec succès" });
      }
      
      // Reload user data to get updated photo after a short delay
      setTimeout(async () => {
        if (email) {
          try {
            const res = await getCurrentUser(email);
            const userData = res.data;
            if (userData && userData.photo) {
              setPreview(`data:image/jpeg;base64,${userData.photo}`);
            }
            // Update user state with latest data
            setUser(prev => ({
              ...prev,
              nom: userData.nom || prev.nom,
              adresse: userData.adresse || prev.adresse,
              identite: userData.identite || prev.identite,
            }));
          } catch (reloadErr) {
            console.error("Erreur lors du rechargement:", reloadErr);
          }
        }
      }, 500);
      
      // Clear file input
      setUser((prev) => ({ ...prev, photo: null }));
    } catch (err) {
      console.error("Erreur update:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      
      let errorMessage = "Erreur lors de la mise à jour du profil";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Utilisateur non trouvé. Veuillez vous reconnecter.";
        } else if (err.response.status === 500) {
          errorMessage = "Erreur serveur. Vérifiez que les colonnes adresse, identite et photo existent dans la table user. Consultez les logs du serveur pour plus de détails.";
        } else if (err.response.data) {
          // Handle different error response formats
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setMessage({ 
        type: "error", 
        text: errorMessage
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="compte-container">
        <div className="compte-loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="compte-container">
      <div className="compte-card">
        <div className="compte-header">
          <h2>Mon Compte</h2>
          <p className="compte-subtitle">Gérez vos informations personnelles</p>
        </div>

        {message.text && (
          <div className={`compte-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="compte-form">
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={user.nom}
              onChange={handleChange}
              placeholder="Votre nom"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adresse">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={user.adresse}
              onChange={handleChange}
              placeholder="Votre adresse"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="identite">Identité</label>
            <input
              type="text"
              id="identite"
              name="identite"
              value={user.identite}
              onChange={handleChange}
              placeholder="Votre identité"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="label-note">(non modifiable)</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              readOnly
              className="form-input readonly-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo de profil</label>
            <div className="photo-upload-section">
              <label htmlFor="photo" className="file-input-label">
                <span className="file-input-text">Choisir un fichier</span>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="file-input"
                />
              </label>
              {preview && (
                <div className="photo-preview">
                  <img src={preview} alt="Aperçu" className="preview-image" />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={updating}
          >
            {updating ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Compte;
