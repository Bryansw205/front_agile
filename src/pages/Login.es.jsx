import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem('token', data.token);
      try { localStorage.setItem('user', JSON.stringify(data.user || {})); } catch {}
      window.location.href = '/';
    } catch (e) {
      setError('Error de autenticación');
    }
  };

  return (
    <div className="auth">
      <div className="auth-left">
        <div className="auth-hero">
          <h1>¡Bienvenido de vuelta!</h1>
          <p>Inicia sesión para continuar gestionando tus préstamos.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <form onSubmit={submit} className="form">
            <img src="/logogrande.jpg" alt="Logo" className="auth-logo" />
            <h2 style={{ margin: 0 }}>Iniciar sesión</h2>
            <div>
              <div className="label">Usuario</div>
              <input className="input" placeholder="Tu usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <div className="label">Contraseña</div>
              <input className="input" type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="badge badge-red" role="alert">{error}</div>}
            <button className="btn btn-primary" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
