import React, { useState } from 'react';

export default function Login() {
  const [Correo, setCorreo] = useState('admin@empresa.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Correo, password })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (e) {
      setError('Error de autenticaci�n');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: 360 }}>
        <form onSubmit={submit} className="form">
          <h3 style={{ margin: 0 }}>Ingresar</h3>
          <div>
            <div className="label">Correo</div>
            <input className="input" value={Correo} onChange={(e) => setCorreo(e.target.value)} />
          </div>
          <div>
            <div className="label">Contrase�a</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="badge badge-red" role="alert">{error}</div>}
          <button className="btn btn-primary" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

