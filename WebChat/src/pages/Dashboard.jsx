import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>WebChat</h1>
                <div className="user-info">
                    <span>Bienvenido, <strong>{user?.name || user?.username}</strong></span>
                    <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
                </div>
            </div>
            
            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2>¡Bienvenido!</h2>
                    <p>Email: {user?.email}</p>
                    <p>Usuario ID: {user?.id}</p>
                    <p>Has iniciado sesión correctamente.</p>
                </div>
            </div>
        </div>
    );
}