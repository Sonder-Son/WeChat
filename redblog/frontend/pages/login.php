<?php
// frontend/pages/login.php
session_start();

// Si ya está logueado, redirigir al home
if(isset($_SESSION['user'])) {
    header('Location: ../index.php');
    exit;
}

$error = '';
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Simulación de login - reemplazar con base de datos real
    if($email === 'admin@redblog.com' && $password === 'password') {
        $_SESSION['user'] = [
            'id' => 1,
            'username' => 'admin',
            'email' => 'admin@redblog.com',
            'role' => 'admin'
        ];
        header('Location: ../index.php');
        exit;
    } else {
        $error = 'Credenciales incorrectas. Usa: admin@redblog.com / password';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - RedBlog</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="form-container">
        <div class="form">
            <h2 class="form-title">Iniciar Sesión en RedBlog</h2>
            
            <?php if($error): ?>
                <div class="error-message">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <input type="email" name="email" class="form-input" placeholder="Email" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <input type="password" name="password" class="form-input" placeholder="Contraseña" required>
                </div>

                <button type="submit" class="form-button">
                    Iniciar Sesión
                </button>

                <a href="register.php" class="text-link">
                    ¿No tienes cuenta? Regístrate aquí
                </a>
            </form>
        </div>
    </div>
</body>
</html>