<?php
session_start();
include_once '../backend/config/database.php';
include_once '../backend/models/Post.php';

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);
$posts = $post->read();
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
        
        <div class="posts-container">
            <?php if($posts->rowCount() > 0): ?>
                <?php while($row = $posts->fetch(PDO::FETCH_ASSOC)): ?>
                <div class="post-card">
                    <div class="vote-section">
                        <button class="vote-btn upvote">▲</button>
                        <span class="vote-count"><?php echo $row['upvotes'] - $row['downvotes']; ?></span>
                        <button class="vote-btn downvote">▼</button>
                    </div>
                    
                    <div class="post-content">
                        <h2 class="post-title"><?php echo htmlspecialchars($row['title']); ?></h2>
                        <p class="post-text"><?php echo htmlspecialchars($row['content']); ?></p>
                        
                        <div class="post-meta">
                            <span>Por <strong><?php echo htmlspecialchars($row['author_name']); ?></strong></span>
                            <span>•</span>
                            <span><?php echo date('d/m/Y', strtotime($row['created_at'])); ?></span>
                            <a href="#" class="comments-link">0 comentarios</a>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            <?php else: ?>
                <div class="no-posts">
                    <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <script src="js/script.js"></script>
</body>
</html>