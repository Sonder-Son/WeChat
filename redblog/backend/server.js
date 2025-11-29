require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware CORS mejorado
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta raíz para evitar "Route not found"
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RedBlog API está funcionando!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: '/api/auth',
      posts: '/api/posts'
    }
  });
});

// Rutas básicas de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'RedBlog API is working!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener posts de ejemplo (temporal)
app.get('/api/posts', (req, res) => {
  const samplePosts = [
    {
      _id: '1',
      title: '¡Bienvenido a RedBlog! 🎉',
      content: 'Esta es una publicación de ejemplo desde el backend. Pronto podrás crear tus propias publicaciones, comentar y votar en el contenido.',
      author: { username: 'admin' },
      createdAt: new Date(),
      upvotes: 15,
      downvotes: 2,
      comments: []
    },
    {
      _id: '2', 
      title: 'Características de RedBlog',
      content: 'RedBlog incluirá: sistema de publicaciones, comentarios, votos, perfiles de usuario, panel de administración y mucho más.',
      author: { username: 'sistema' },
      createdAt: new Date(),
      upvotes: 8,
      downvotes: 1,
      comments: []
    },
    {
      _id: '3',
      title: 'Tecnologías Utilizadas',
      content: 'Este proyecto usa el stack MERN: MongoDB, Express.js, React y Node.js. Además de herramientas como JWT para autenticación.',
      author: { username: 'dev' },
      createdAt: new Date(),
      upvotes: 12,
      downvotes: 0,
      comments: []
    }
  ];
  res.json(samplePosts);
});

// Importar rutas (si existen)
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (error) {
  console.log('⚠️ Ruta /api/auth no disponible aún');
}

try {
  app.use('/api/posts', require('./routes/posts'));
} catch (error) {
  console.log('⚠️ Ruta /api/posts no disponible aún');
}

try {
  app.use('/api/users', require('./routes/users'));
} catch (error) {
  console.log('⚠️ Ruta /api/users no disponible aún');
}

try {
  app.use('/api/admin', require('./routes/admin'));
} catch (error) {
  console.log('⚠️ Ruta /api/admin no disponible aún');
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor!' });
});

// Ruta 404 - debe ir al final
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    availableRoutes: ['/', '/api/health', '/api/test', '/api/posts']
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL Cliente: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/redblog'}`);
  console.log(`📍 Endpoints disponibles:`);
  console.log(`   - http://localhost:${PORT}/`);
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/test`);
  console.log(`   - http://localhost:${PORT}/api/posts`);
});