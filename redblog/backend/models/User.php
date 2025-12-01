<?php
// backend/models/User.php - VERSIÓN CORREGIDA
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $role;
    public $is_active;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // MÉTODO CREATE CORREGIDO
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " 
                    SET username=:username, email=:email, password=:password, role=:role";
            
            $stmt = $this->conn->prepare($query);

            // Limpiar y validar datos
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->role = htmlspecialchars(strip_tags($this->role));

            // Verificar si el usuario ya existe
            if ($this->emailExists() || $this->usernameExists()) {
                return array("success" => false, "message" => "El email o usuario ya existe");
            }

            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":role", $this->role);

            // Hash de la contraseña
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(":password", $password_hash);

            if($stmt->execute()) {
                // Obtener el ID del usuario recién creado
                $this->id = $this->conn->lastInsertId();
                return array("success" => true, "user_id" => $this->id);
            } else {
                return array("success" => false, "message" => "Error al crear usuario");
            }
        } catch(PDOException $exception) {
            return array("success" => false, "message" => "Error de base de datos: " . $exception->getMessage());
        }
    }

    // VERIFICAR SI EL EMAIL EXISTE
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // VERIFICAR SI EL USERNAME EXISTE
    public function usernameExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // MÉTODO LOGIN MEJORADO
    public function login($email, $password) {
        try {
            $query = "SELECT id, username, email, password, role, is_active 
                     FROM " . $this->table_name . " 
                     WHERE email = ? LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Verificar contraseña
                if (password_verify($password, $row['password'])) {
                    if($row['is_active']) {
                        return array(
                            "success" => true,
                            "user" => array(
                                "id" => $row['id'],
                                "username" => $row['username'],
                                "email" => $row['email'],
                                "role" => $row['role']
                            )
                        );
                    } else {
                        return array("success" => false, "message" => "Cuenta desactivada");
                    }
                }
            }
            return array("success" => false, "message" => "Credenciales incorrectas");
        } catch(PDOException $exception) {
            return array("success" => false, "message" => "Error de base de datos");
        }
    }

    // OBTENER USUARIO POR ID
    public function readOne() {
        $query = "SELECT username, email, role, created_at 
                 FROM " . $this->table_name . " 
                 WHERE id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
}
?>