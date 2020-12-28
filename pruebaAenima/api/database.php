<?php 
    define('server', 'localhost');
    define('user', "root");
    define('pass', '');
    define('name', 'pruebaAenima');
    define('port', null);

    class db {
        protected $db;

        public function __construct(){
            $this->db = new mysqli(server, user, pass, name);
        }

        public function buildQuery($data){
            $fields = '*';  $where = '';  $join = '';

            switch ($data->method) {
                case 'select':
                    if($data->select)$fields = arrayToString($data->select, ',');
                    if(isset($data->where)) $where = 'where '.arrayToString($data->where, '&&');
                    $url = "select $fields from $data->from $where";
                break;
                case 'insert':
                    $values = arrayToString($data->values, "','");
                    $url = "insert into $data->into values ('$values')";
                break;
                case 'update':
                    $values = arrayToString($data->set, ',');
                    $where = arrayToString($data->where, '&&');
                    $url = "update $data->update set $values where $where";
                break;
                case 'delete':
                    $where = arrayToString($data->where, '&&');
                    $url = "delete from $data->from where $where";
                break;
            }
            return $url;
        }

    }

    function arrayToString($array, $delimiter){
        $url = '';
        foreach($array as $key => $value){
            if(!is_numeric($key)){
                $url .= "$key = '$value'$delimiter";
            } else {
                $url .= "$value$delimiter";
            }
        }
        return rtrim($url, $delimiter);
    }
?>