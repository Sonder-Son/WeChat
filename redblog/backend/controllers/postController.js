const Post = require('../models/Post');
const User = require('../models/User');

// Obtener todas las publicaciones
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener una publicación por ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear una nueva publicación
exports.createPost = async (req, res) => {
  try {
    const { title, content, type, imageUrl, linkUrl } = req.body;

    const newPost = new Post({
      title,
      content,
      type,
      imageUrl,
      linkUrl,
      author: req.user.id
    });

    const post = await newPost.save();
    await post.populate('author', 'username');
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar una publicación
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Verificar que el usuario es el autor
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Usuario no autorizado' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('author', 'username');

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar una publicación
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Verificar que el usuario es el autor o es admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Usuario no autorizado' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Publicación eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Votar una publicación
exports.votePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const { voteType } = req.body; // 'upvote' o 'downvote'

    // Lógica de votación (simplificada)
    if (voteType === 'upvote') {
      post.upvotes += 1;
    } else if (voteType === 'downvote') {
      post.downvotes += 1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Comentar una publicación
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const { content } = req.body;

    const newComment = {
      user: req.user.id,
      content,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate para devolver el username del usuario
    await post.populate('comments.user', 'username');
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};