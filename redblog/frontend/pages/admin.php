<?php
// frontend/pages/admin.php
session_start();

if(!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header('Location: ../index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - RedBlog</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="container">
        <h1 class="page-title">Panel de Administración</h1>
        
        <div class="card">
            <h2>Funcionalidades de Administración</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">
                Panel en desarrollo. Pronto tendrás acceso a:
            </p>
            <ul style="color: #4b5563; margin-left: 1.5rem;">
                <li>Gestión de usuarios</li>
                <li>Moderación de contenido</li>
                <li>Estadísticas de la plataforma</li>
                <li>Configuración del sistema</li>
            </ul>
        </div>
        
        <a href="../index.php" class="form-button" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
            Volver al Inicio
        </a>
    </div>
    <script src="../js/script.js"></script>
</body>
</html>
