import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';

// --- Formulaires ---
export const getFormulaires = () => axios.get(`${API_BASE}/formulaires`);
export const getFormulaireById = (id) => axios.get(`${API_BASE}/formulaires/${id}`);
export const addFormulaire = (data) => axios.post(`${API_BASE}/formulaires/add`, data);
export const updateFormulaire = (id, data) => axios.put(`${API_BASE}/formulaires/${id}`, data);
export const deleteFormulaire = (id) => axios.delete(`${API_BASE}/formulaires/${id}`);

// --- Questions ---
export const getQuestions = () => axios.get(`${API_BASE}/questions`);
export const getQuestionById = (id) => axios.get(`${API_BASE}/questions/${id}`);
export const getQuestionsByFormulaire = (idFormulaire) => axios.get(`${API_BASE}/questions/formulaire/${idFormulaire}`);
export const addQuestion = (data) => axios.post(`${API_BASE}/questions/add`, data);
export const updateQuestion = (id, data) => axios.put(`${API_BASE}/questions/${id}`, data);
export const deleteQuestion = (id) => axios.delete(`${API_BASE}/questions/${id}`);

// --- ReponseFormulaire ---
export const getReponsesFormulaire = () => axios.get(`${API_BASE}/reponses-formulaire`);
export const getReponseFormulaireById = (id) => axios.get(`${API_BASE}/reponses-formulaire/${id}`);
export const getReponsesByFormulaireId = (idFormulaire) => axios.get(`${API_BASE}/reponses-formulaire/formulaire/${idFormulaire}`);
export const getReponsesByUtilisateurId = (idUtilisateur) => axios.get(`${API_BASE}/reponses-formulaire/utilisateur/${idUtilisateur}`);
export const addReponseFormulaire = (data) => axios.post(`${API_BASE}/reponses-formulaire/add`, data);
export const updateReponseFormulaire = (id, data) => axios.put(`${API_BASE}/reponses-formulaire/${id}`, data);
export const deleteReponseFormulaire = (id) => axios.delete(`${API_BASE}/reponses-formulaire/${id}`);

// --- ReponseQuestion ---
export const getReponsesQuestion = () => axios.get(`${API_BASE}/reponses-question`);
export const getReponseQuestionById = (id) => axios.get(`${API_BASE}/reponses-question/${id}`);
export const getReponsesByQuestionId = (idQuestion) => axios.get(`${API_BASE}/reponses-question/question/${idQuestion}`);
export const addReponseQuestion = (data) => axios.post(`${API_BASE}/reponses-question/add`, data);
export const updateReponseQuestion = (id, data) => axios.put(`${API_BASE}/reponses-question/${id}`, data);
export const deleteReponseQuestion = (id) => axios.delete(`${API_BASE}/reponses-question/${id}`);

// --- Evaluation Link ---
export const generateEvaluationLink = (formId, payload = {}) => 
  axios.post(`${API_BASE}/forms/${formId}/generate-link`, payload);

export const accessFormByToken = (token) => 
  axios.get(`${API_BASE}/forms/access/${token}`);

export const submitAnswersByToken = (token, data) => 
  axios.post(`${API_BASE}/forms/submit/${token}`, data);

export const listLinksByForm = (formId) => 
  axios.get(`${API_BASE}/forms/${formId}/links`);

export const listResponsesByForm = (formId) =>
  axios.get(`${API_BASE}/forms/${formId}/responses`);

// --- Users ---
export const getCurrentUser = (email) =>
  axios.get(`${API_BASE}/users/me`, { params: { email } });

export const getUserById = (id) =>
  axios.get(`${API_BASE}/users/${id}`);

export const updateUser = (id, formData) =>
  axios.put(`${API_BASE}/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// --- Etudiants (Evaluators) ---
export const getEtudiants = () => axios.get(`${API_BASE}/etudiants`);
export const getEtudiantById = (id) => axios.get(`${API_BASE}/etudiants/${id}`);
export const createEtudiant = (data) => axios.post(`${API_BASE}/etudiants`, data);
export const updateEtudiant = (id, data) => axios.put(`${API_BASE}/etudiants/${id}`, data);
export const deleteEtudiant = (id) => axios.delete(`${API_BASE}/etudiants/${id}`);

// --- Send Email ---
export const sendEvaluationLink = (formId, evaluatorId, linkToken) =>
  axios.post(`${API_BASE}/forms/${formId}/send-link`, {
    evaluatorId: evaluatorId,
    linkToken: linkToken
  });

// --- Test Email ---
export const testEmail = (toEmail, evaluatorName, formTitle) =>
  axios.post(`${API_BASE}/formulaires/test-email`, {
    toEmail: toEmail,
    evaluatorName: evaluatorName,
    formTitle: formTitle
  });

// --- Debug Send Link ---
export const debugSendLink = (formId, evaluatorId, linkToken) =>
  axios.post(`${API_BASE}/forms/${formId}/send-link-debug`, {
    evaluatorId: evaluatorId,
    linkToken: linkToken
  });

// --- Test Email Configuration ---
export const testEmailConfiguration = (toEmail) =>
  axios.post(`${API_BASE}/email-test/send-test`, {
    toEmail: toEmail
  });

// --- Statistics ---
export const getGlobalStatistics = () =>
  axios.get(`${API_BASE}/statistics/global`);

export const getFormStatistics = (formId) =>
  axios.get(`${API_BASE}/statistics/form/${formId}`);

export const getAllFormsStatistics = () =>
  axios.get(`${API_BASE}/statistics/all-forms`);