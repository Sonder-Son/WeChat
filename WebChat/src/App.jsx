import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [user]);

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    const login = async (username, password) => {
        const res = await apiLogin(username, password);
        setUser(res.user);
        setToken(res.token);
        return res;
    };

    const register = async (userData) => {
        const res = await apiRegister(userData);
        setUser(res.user);
        setToken(res.token);
        return res;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Base de datos simulada en localStorage
const DB_KEY = 'webchat_users';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export async function register(userData) {
    await new Promise(r => setTimeout(r, 500));
    
    const { username, email, password, confirmPassword } = userData;
    
    if (!username || !email || !password) {
        throw new Error('Todos los campos son requeridos');
    }
    
    if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
    }
    
    if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        throw new Error('El usuario ya existe');
    }
    
    if (users.find(u => u.email === email)) {
        throw new Error('El email ya está registrado');
    }
    
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: btoa(password), // encoding simple (NO usar en producción)
        name: username,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return {
        user: { id: newUser.id, username: newUser.username, email: newUser.email, name: newUser.name },
        token: `token_${newUser.id}`
    };
}

export async function login(username, password) {
    await new Promise(r => setTimeout(r, 500));
    
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || btoa(password) !== user.password) {
        throw new Error('Usuario o contraseña inválidos');
    }
    
    return {
        user: { id: user.id, username: user.username, email: user.email, name: user.name },
        token: `token_${user.id}`
    };
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input 
                            id="username"
                            type="text"
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            id="password"
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Cargando...' : 'Entrar'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                    <p className="demo-hint">Demo: admin / password123</p>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input 
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input 
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Cargando...' : 'Crear Cuenta'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    );
}

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

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}