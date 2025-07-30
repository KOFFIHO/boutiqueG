// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './login.css';


export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = res.data;

      // Stocker les tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Définir le token pour les prochaines requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      onLogin();  // Appelle le parent pour rediriger après connexion
    } catch (error) {
      alert("Identifiants invalides");
    }
  };

  return (
  <div className="login-container">
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Connexion</h2>

      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button type="submit">Se connecter</button>
    </form>
  </div>
);

}
