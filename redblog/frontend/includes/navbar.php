<?php
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : null;
?>
<nav class="navbar">
    <div class="nav-container">
        <a href="index.php" class="nav-logo">RedBlog</a>
        
        <div class="nav-links">
            <?php if($current_user): ?>
                <a href="pages/create-post.php" class="nav-link">Crear Post</a>
                <a href="pages/profile.php" class="nav-link">Perfil</a>
                <?php if($current_user['role'] === 'admin'): ?>
                    <a href="pages/admin.php" class="nav-link">Admin</a>
                <?php endif; ?>
                <a href="pages/logout.php" class="nav-button">Cerrar Sesión</a>
                <span class="user-welcome">Hola, <?php echo $current_user['username']; ?></span>
            <?php else: ?>
                <a href="pages/login.php" class="nav-link">Iniciar Sesión</a>
                <a href="pages/register.php" class="nav-button">Registrarse</a>
            <?php endif; ?>
        </div>
    </div>
</nav>