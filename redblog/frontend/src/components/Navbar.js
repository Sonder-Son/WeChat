import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          RedBlog
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/create-post" className="nav-link">
                Crear Post
              </Link>
              <Link to="/profile" className="nav-link">
                Perfil
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="nav-button"
              >
                Cerrar Sesión
              </button>
              <span style={{ color: '#dbeafe' }}>
                Hola, {user.username}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="nav-button"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;