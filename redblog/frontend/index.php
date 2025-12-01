<?php
// frontend/index.php - Versión mejorada con manejo de errores
session_start();

// Inicializar variables
$posts = [];
$error = '';

try {
    // Intentar cargar las dependencias del backend
    if(file_exists('../backend/config/database.php') && file_exists('../backend/models/Post.php')) {
        include_once '../backend/config/database.php';
        include_once '../backend/models/Post.php';
        
        $database = new Database();
        $db = $database->getConnection();
        $post = new Post($db);
        $posts_result = $post->read();
        
        // Convertir resultado a array
        if($posts_result instanceof PDOStatement) {
            $posts = $posts_result->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // Si es datos de ejemplo
            $posts = iterator_to_array($posts_result);
        }
    } else {
        throw new Exception("Archivos del backend no encontrados");
    }
} catch(Exception $e) {
    // Si hay error, usar datos de ejemplo
    $error = "Usando datos de ejemplo: " . $e->getMessage();
    $posts = [
        [
            'id' => 1,
            'title' => '¡Bienvenido a RedBlog! 🎉',
            'content' => 'Esta es una publicación de ejemplo. La aplicación está funcionando correctamente.',
            'author_name' => 'admin',
            'upvotes' => 15,
            'downvotes' => 2,
            'created_at' => date('Y-m-d H:i:s'),
            'comments' => []
        ],
        [
            'id' => 2,
            'title' => 'Características de la Plataforma',
            'content' => 'Puedes crear publicaciones, comentar, votar y mucho más. ¡La base de datos se conectará pronto!',
            'author_name' => 'sistema',
            'upvotes' => 8,
            'downvotes' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'comments' => []
        ],
        [
            'id' => 3,
            'title' => 'Tecnologías Utilizadas',
            'content' => 'PHP, MySQL, HTML5, CSS3 y JavaScript. Stack moderno y eficiente para aplicaciones web.',
            'author_name' => 'dev',
            'upvotes' => 12,
            'downvotes' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'comments' => []
        ]
    ];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedBlog - Plataforma Comunitaria</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <main class="container">
        <h1 class="page-title">Publicaciones Recientes</h1>
        
        <?php if($error): ?>
            <div class="error-message" style="background: #fef3c7; color: #92400e; border-color: #f59e0b;">
                ⚠️ <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <div class="posts-container">
            <?php if(empty($posts)): ?>
                <div class="no-posts">
                    <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
                    <?php if(isset($_SESSION['user'])): ?>
                        <a href="pages/create-post.php" class="nav-button" style="display: inline-block; margin-top: 1rem;">
                            Crear Primera Publicación
                        </a>
                    <?php else: ?>
                        <a href="pages/register.php" class="nav-button" style="display: inline-block; margin-top: 1rem;">
                            Regístrate para Publicar
                        </a>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <?php foreach($posts as $post): ?>
                <div class="post-card">
                    <div class="vote-section">
                        <button class="vote-btn upvote">▲</button>
                        <span class="vote-count"><?php echo $post['upvotes'] - $post['downvotes']; ?></span>
                        <button class="vote-btn downvote">▼</button>
                    </div>
                    
                    <div class="post-content">
                        <h2 class="post-title"><?php echo htmlspecialchars($post['title']); ?></h2>
                        <p class="post-text"><?php echo htmlspecialchars($post['content']); ?></p>
                        
                        <div class="post-meta">
                            <span>Por <strong><?php echo htmlspecialchars($post['author_name']); ?></strong></span>
                            <span>•</span>
                            <span><?php echo date('d/m/Y', strtotime($post['created_at'])); ?></span>
                            <a href="#" class="comments-link">
                                <?php echo isset($post['comments']) ? count($post['comments']) : 0; ?> comentarios
                            </a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </main>

    <script src="js/script.js"></script>
</body>
</html>