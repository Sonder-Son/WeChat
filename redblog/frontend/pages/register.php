<?php
// frontend/pages/register.php - VERSIÓN CON BASE DE DATOS REAL
session_start();

if(isset($_SESSION['user'])) {
    header('Location: ../index.php');
    exit;
}

// Incluir modelos de base de datos
include_once '../../backend/config/database.php';
include_once '../../backend/models/User.php';

$error = '';
$success = '';

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
    } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'El formato del email no es válido';
    } else {
        try {
            // Conectar a la base de datos
            $database = new Database();
            $db = $database->getConnection();
            
            // Crear objeto User
            $user = new User($db);
            $user->username = $username;
            $user->email = $email;
            $user->password = $password;
            $user->role = 'user';
            
            // Intentar crear el usuario
            $result = $user->create();
            
            if($result['success']) {
                // Registro exitoso - hacer login automático
                $login_result = $user->login($email, $password);
                
                if($login_result['success']) {
                    $_SESSION['user'] = $login_result['user'];
                    $success = '¡Registro exitoso! Bienvenido a RedBlog';
                    // Redirigir después de 2 segundos
                    header('Refresh: 2; URL=../index.php');
                } else {
                    $error = 'Registro exitoso pero error al iniciar sesión. Por favor inicia sesión manualmente.';
                }
            } else {
                $error = $result['message'];
            }
            
        } catch(Exception $e) {
            $error = 'Error del sistema: ' . $e->getMessage();
        }
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
                    ❌ <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <?php if($success): ?>
                <div class="success-message">
                    ✅ <?php echo $success; ?>
                    <p>Redirigiendo al inicio...</p>
                </div>
            <?php else: ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="username">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" class="form-input" 
                           placeholder="Ej: juan123" required
                           value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-input" 
                           placeholder="ejemplo@correo.com" required
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" class="form-input" 
                           placeholder="Mínimo 6 caracteres" required>
                    <small style="color: #6b7280; font-size: 0.875rem;">Mínimo 6 caracteres</small>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirmar contraseña:</label>
                    <input type="password" id="confirm_password" name="confirm_password" 
                           class="form-input" placeholder="Repite tu contraseña" required>
                </div>

                <button type="submit" class="form-button">
                    Crear Cuenta
                </button>

                <div style="text-align: center; margin-top: 1rem;">
                    <span style="color: #6b7280;">¿Ya tienes cuenta? </span>
                    <a href="login.php" class="text-link">Inicia sesión aquí</a>
                </div>
            </form>
            
            <?php endif; ?>
        </div>
    </div>
    <script src="../js/script.js"></script>
</body>
</html>