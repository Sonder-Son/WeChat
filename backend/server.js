// backend/server.js - VERSIÓN CORREGIDA
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear la aplicación Express
const app = express();

// Middlewares BÁSICOS - SIN RUTAS POR AHORA
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (versión simplificada)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reddit-clone');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.log('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// CONECTAR PRIMERO A LA BASE DE DATOS
connectDB();

// ✅ RUTA DE PRUEBA SIMPLE - PARA VERIFICAR QUE FUNCIONA
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '¡El servidor está funcionando! 🎉',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ✅ RUTA DE PRUEBA 2
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido al API de Reddit Clone',
    version: '1.0.0'
  });
});

// ✅ MANEJAR RUTAS NO ENCONTRADAS
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// ✅ MANEJAR ERRORES
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});