// frontend/src/services/authService.js
import API from './api';

export const authService = {
  // Login de usuario
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  // Registro de usuario
  register: async (username, email, password) => {
    const response = await API.post('/auth/register', { 
      username, 
      email, 
      password 
    });
    return response.data;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },

  // Verificar si el backend está funcionando
  testBackend: async () => {
    const response = await API.get('/test');
    return response.data;
  }
};