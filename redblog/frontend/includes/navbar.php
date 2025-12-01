<?php
// frontend/includes/navbar.php

$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : null;
?>
<nav class="navbar">
    <div class="nav-container">
        <!-- Logo con ruta absoluta -->
        <a href="/frontend/index.php" class="nav-logo">RedBlog</a>
        
        <div class="nav-links">
            <!-- Botón de cambio de tema (mantenido) -->
            <button class="theme-toggle" id="themeToggle" title="Cambiar tema">
                🌙
            </button>
            
            <?php if($current_user): ?>
                <!-- Enlaces para usuarios logueados con rutas absolutas -->
                <a href="/frontend/pages/create-post.php" class="nav-link">Crear Post</a>
                <a href="/frontend/pages/profile.php" class="nav-link">Perfil</a>
                
                <?php if($current_user['role'] === 'admin'): ?>
                    <a href="/frontend/pages/admin.php" class="nav-link">Admin</a>
                <?php endif; ?>
                
                <!-- Cerrar Sesión con ruta absoluta -->
                <a href="/frontend/pages/logout.php" class="nav-button">Cerrar Sesión</a>
                <span class="user-welcome">Hola, <?php echo htmlspecialchars($current_user['username']); ?></span>
                
            <?php else: ?>
                <!-- Enlaces para usuarios NO logueados con rutas absolutas -->
                <a href="/frontend/pages/login.php" class="nav-link">Iniciar Sesión</a>
                <a href="/frontend/pages/register.php" class="nav-button">Registrarse</a>
            <?php endif; ?>
        </div>
    </div>
</nav>
