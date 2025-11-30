<?php
class Post {
    private $conn;
    private $table_name = "posts";

    public $id;
    public $title;
    public $content;
    public $author_id;
    public $type;
    public $image_url;
    public $link_url;
    public $upvotes;
    public $downvotes;
    public $is_public;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT p.*, u.username as author_name 
                FROM " . $this->table_name . " p 
                LEFT JOIN users u ON p.author_id = u.id 
                WHERE p.is_public = 1 
                ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET title=:title, content=:content, author_id=:author_id, type=:type, image_url=:image_url, link_url=:link_url";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->author_id = htmlspecialchars(strip_tags($this->author_id));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->link_url = htmlspecialchars(strip_tags($this->link_url));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":author_id", $this->author_id);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":link_url", $this->link_url);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>