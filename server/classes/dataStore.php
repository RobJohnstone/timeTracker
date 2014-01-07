<?php

class Datastore{
    /* Properties */
    private $dbConn;

    private static $instance;
    
    /* Methods */
    public function __construct() {
        global $settings;
        self::connect($settings['dbHost'], $settings['dbName'], $settings['dbUsername'], $settings['dbPassword']);
        self::$instance = $this;     
    }

    public static function getInstance() {
        if (isset(self::$instance)) {
            return self::$instance;
        }
        else {
            return new Datastore();
        }
    }

    private function connect($host, $dbName, $username, $password) {
        try {
            $this->dbConn = new PDO('mysql:host='.$host.';dbname='.$dbName, $username, $password);
        }
        catch (PDOException $e) {
            throw new DatastoreException('Error connecting to database: '.$e->getMessage());
        }
    }

    public function prepare($sql) {
        try {
            $stmt = $this->dbConn->prepare($sql);
            if ($stmt) {
                return $stmt;
            }
            else {
                throw new DatastoreException('Failed to prepare statement for '.$sql);
            }
        }
        catch (PDOException $e) {
            throw new DatastoreException('Error preparing statement in datastore->prepare(): '.$e->getMessage());
            return false;
        }
    }

    public function execute($stmt, $params) {
        $result = $stmt->execute($params);
        if (!$result) {
            $error = $stmt->errorInfo();
            throw new DatastoreException('execute unsuccessful in datastore->execute(): '.$error[2]);
        }
        return $result;
    }

    public function lastInsertId() {
        return $this->dbConn->lastInsertId();
    }
}

class DatastoreException extends Exception {}
?>
