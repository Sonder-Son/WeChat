<?php
// frontend/pages/create-post.php
session_start();

if(!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

// Por ahora es solo un placeholder
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Post - RedBlog</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="container">
        <div class="form-container">
            <div class="form">
                <h2 class="form-title">Crear Nueva Publicación</h2>
                <p style="text-align: center; color: #6b7280;">
                    Funcionalidad en desarrollo. Pronto podrás crear publicaciones.
                </p>
                <a href="../index.php" class="form-button" style="text-decoration: none; text-align: center;">
                    Volver al Inicio
                </a>
            </div>
        </div>
    </div>
    <script src="../js/script.js"></script>
</body>
</html>