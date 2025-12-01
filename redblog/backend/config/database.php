<?php
// backend/config/database.php
class Database {
    // Configuración de la base de datos - ¡VERIFICA ESTOS DATOS!
    private $host = "localhost";      // Normalmente es localhost
    private $db_name = "redblog";     // Nombre de tu base de datos
    private $username = "root";       // Usuario de MySQL (por defecto: root)
    private $password = "";           // Contraseña de MySQL (por defecto: vacía)
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            // Crear conexión PDO
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                $this->username, 
                $this->password
            );
            
            // Configurar opciones de PDO
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            echo "<!-- ✅ Conexión a MySQL exitosa -->";
            
        } catch(PDOException $exception) {
            // Si hay error, mostrarlo (solo en desarrollo)
            echo "<!-- ❌ Error de conexión: " . $exception->getMessage() . " -->";
            
            // También puedes loggear el error
            error_log("Error de conexión MySQL: " . $exception->getMessage());
        }
        
        return $this->conn;
    }
}
?>