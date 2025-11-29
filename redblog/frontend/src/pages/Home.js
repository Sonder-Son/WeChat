import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Intentar cargar posts desde el backend
      const response = await fetch('http://localhost:5000/api/posts');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(data);
      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('No se pudieron cargar las publicaciones. Usando datos de ejemplo.');
      // Datos de ejemplo como fallback
      setPosts([
        {
          _id: '1',
          title: '¡Bienvenido a RedBlog! 🎉',
          content: 'Esta es una publicación de ejemplo. El backend está funcionando correctamente en el puerto 5000.',
          author: { username: 'admin' },
          createdAt: new Date(),
          upvotes: 15,
          downvotes: 2,
          comments: []
        },
        {
          _id: '2', 
          title: 'Características de RedBlog',
          content: 'RedBlog incluirá: sistema de publicaciones, comentarios, votos, perfiles de usuario y panel de administración.',
          author: { username: 'sistema' },
          createdAt: new Date(),
          upvotes: 8,
          downvotes: 1,
          comments: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="card-title mb-8 text-center">
        Publicaciones Recientes
      </h1>
      
      {error && (
        <div className="error-message mb-4">
          ⚠️ {error}
        </div>
      )}
      
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center text-gray-600">
            No hay publicaciones aún. ¡Sé el primero en publicar!
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="card">
              <div className="flex items-start">
                {/* Sistema de votos */}
                <div className="vote-system">
                  <button className="vote-button">▲</button>
                  <span className="vote-count">{post.upvotes - post.downvotes}</span>
                  <button className="vote-button downvote">▼</button>
                </div>

                {/* Contenido del post */}
                <div style={{ flex: 1 }}>
                  <h2 className="card-title">{post.title}</h2>
                  <p className="card-content">{post.content}</p>
                  
                  <div className="card-meta">
                    <span>Publicado por <strong>{post.author.username}</strong></span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
                    <button className="text-link" style={{ margin: 0, padding: 0 }}>
                      {post.comments ? post.comments.length : 0} comentarios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;