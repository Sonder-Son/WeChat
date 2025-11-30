<?php
// frontend/pages/register.php
session_start();

if(isset($_SESSION['user'])) {
    header('Location: ../index.php');
    exit;
}

$error = '';
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Validaciones básicas
    if(empty($username) || empty($email) || empty($password)) {
        $error = 'Todos los campos son obligatorios';
    } elseif($password !== $confirm_password) {
        $error = 'Las contraseñas no coinciden';
    } elseif(strlen($password) < 6) {
        $error = 'La contraseña debe tener al menos 6 caracteres';
    } else {
        // Simulación de registro exitoso
        $_SESSION['user'] = [
            'id' => 2,
            'username' => $username,
            'email' => $email,
            'role' => 'user'
        ];
        header('Location: ../index.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrarse - RedBlog</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="form-container">
        <div class="form">
            <h2 class="form-title">Registrarse en RedBlog</h2>
            
            <?php if($error): ?>
                <div class="error-message">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <input type="text" name="username" class="form-input" placeholder="Nombre de usuario" required
                           value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <input type="email" name="email" class="form-input" placeholder="Email" required
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <input type="password" name="password" class="form-input" placeholder="Contraseña" required>
                </div>
                
                <div class="form-group">
                    <input type="password" name="confirm_password" class="form-input" placeholder="Confirmar contraseña" required>
                </div>

                <button type="submit" class="form-button">
                    Registrarse
                </button>

                <a href="login.php" class="text-link">
                    ¿Ya tienes cuenta? Inicia sesión aquí
                </a>
            </form>
        </div>
    </div>
</body>
</html>