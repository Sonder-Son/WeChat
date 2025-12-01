<?php
// frontend/pages/login.php - VERSIÓN CON RUTAS ABSOLUTAS
session_start();

if(isset($_SESSION['user'])) {
    header('Location: /frontend/index.php');
    exit;
}

// Incluir modelos de base de datos
include_once '../../backend/config/database.php';
include_once '../../backend/models/User.php';

$error = '';
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if(empty($email) || empty($password)) {
        $error = 'Email y contraseña son obligatorios';
    } else {
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $user = new User($db);
            $result = $user->login($email, $password);
            
            if($result['success']) {
                $_SESSION['user'] = $result['user'];
                header('Location: /frontend/index.php');
                exit;
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
    <title>Iniciar Sesión - RedBlog</title>
    <link rel="stylesheet" href="/frontend/css/style.css">
</head>
<body>
    <?php include '../includes/navbar.php'; ?>

    <div class="form-container">
        <div class="form">
            <h2 class="form-title">Iniciar Sesión</h2>
            
            <?php if($error): ?>
                <div class="error-message">
                    ❌ <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <!-- Ruta absoluta en el action -->
            <form method="POST" action="/frontend/pages/login.php">
                
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-input" 
                           placeholder="tu@email.com" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" class="form-input" 
                           placeholder="Tu contraseña" required>
                </div>

                <button type="submit" class="form-button">
                    Iniciar Sesión
                </button>

                <div style="text-align: center; margin-top: 1rem;">
                    <span style="color: #6b7280;">¿No tienes cuenta? </span>
                    <a href="/frontend/pages/register.php" class="text-link">Regístrate aquí</a>
                </div>

                <!-- Credenciales de prueba -->
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 6px; margin-top: 1.5rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #374151;">Credenciales de prueba:</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.875rem;">
                        <strong>Admin:</strong> admin@redblog.com / password
                    </p>
                    <p style="margin: 0.25rem 0; font-size: 0.875rem;">
                        <strong>Usuario:</strong> usuario1@redblog.com / password
                    </p>
                </div>
            </form>
        </div>
    </div>
    <script src="/frontend/js/script.js"></script>
</body>
</html>