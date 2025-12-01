<?php
// frontend/pages/profile.php
session_start();

if(!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Perfil - RedBlog</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="container">
        <div class="form-container">
            <div class="form">
                <h2 class="form-title">Mi Perfil</h2>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><strong>Usuario:</strong> <?php echo htmlspecialchars($user['username']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                    <p><strong>Rol:</strong> <?php echo htmlspecialchars($user['role']); ?></p>
                </div>
                
                <a href="../index.php" class="form-button" style="text-decoration: none; text-align: center;">
                    Volver al Inicio
                </a>
            </div>
        </div>
    </div>
    <script src="../js/script.js"></script>
</body>
</html>