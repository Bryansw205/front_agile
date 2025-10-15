import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const [hasLogo, setHasLogo] = React.useState(true);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setHasLogo(true);
    img.onerror = () => setHasLogo(false);
    img.src = '/logo.png';
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
  const username = user.username || '';
  const initial = (username || '?').slice(0,1).toUpperCase();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          {hasLogo ? (
            <img className="brand-logo" src="/logo.png" alt="Logo" />
          ) : (
            <div className="brand-badge">GP</div>
          )}
          Gestión de Préstamos
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({isActive})=> isActive? 'active' : ''}>Nuevo Préstamo</NavLink>
          <NavLink to="/clients" className={({isActive})=> isActive? 'active' : ''}>Clientes</NavLink>
        </nav>

        <div className="push-bottom">
          <div className="user-card">
            <div className="user-info">
              <div className="user-avatar" aria-hidden>{initial}</div>
              <div className="user-text">
                <div style={{fontWeight:700, lineHeight:1}}>{username}</div>
                <div className="muted" style={{fontSize:12, lineHeight:1}}>Sesión activa</div>
              </div>
            </div>
            <button className="icon-btn" title="Salir" onClick={logout} aria-label="Salir">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="content">
        <div className="topbar">
          <h1 className="muted">Panel</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
