import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap (si vous voulez le garder)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);