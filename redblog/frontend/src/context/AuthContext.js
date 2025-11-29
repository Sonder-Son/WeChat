import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulación de datos de usuario para desarrollo
  useEffect(() => {
    const timer = setTimeout(() => {
      // Por ahora usamos datos simulados
      // setUser(null); // Para probar como usuario no logueado
      setUser({ // Para probar como usuario logueado
        id: '1',
        username: 'usuarioDemo',
        email: 'demo@redblog.com',
        role: 'user'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulación de login - reemplazar con API real después
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: '1',
          username: email.split('@')[0],
          email: email,
          role: 'user'
        };
        setUser(userData);
        setLoading(false);
        resolve({ success: true, user: userData });
      }, 1500);
    });
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulación de registro - reemplazar con API real después
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: '2',
          username: username,
          email: email,
          role: 'user'
        };
        setUser(userData);
        setLoading(false);
        resolve({ success: true, user: userData });
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};