<?php 
    error_reporting(E_ALL);
    require(__DIR__.'/../database.php');

    class products extends db{

        public function products(){
            parent::__construct();
        }

        public function getAll(){
            $data = new stdClass();
            $data->method = 'select';
            $data->select = ['*'];
            $data->from = 'productos_view';

            return $this->db->query($this->buildQuery($data))->fetch_all(MYSQLI_ASSOC);
        }

        public function getById($id){
            $data = new stdClass();
            $data->method = 'select'; $data->select = ['*']; $data->from = 'productos_view';
            $data->where = ['id'=>$id];

            return $this->db->query($this->buildQuery($data))->fetch_assoc();
        }

        public function add($productData){
            $data = new stdClass();
            $data->method = 'insert';
            $data->into = 'productos (nombre, marca, imagen, descripcion, precio)';
            $data->values = [
                $productData->nombre,
                $this->checkMarca($productData->marca),
                $productData->imagen,
                $productData->descripcion,
                $productData->precio
            ];

            return $this->db->query($this->buildQuery($data));
        }

        public function remove($id){
            $data = new stdClass();
            $data->method = 'delete';
            $data->from = 'productos';
            $data->where = ["id"=>$id];

            return $this->db->query($this->buildQuery($data));
        }

        public function update($productData){
            $data = new stdClass();
            $data->method = 'update';
            $data->update = 'productos';
            $data->set = [
                "nombre"=>$productData->nombre,
                "marca"=>$this->checkMarca($productData->marca),
                "descripcion"=>$productData->descripcion,
                "precio"=>$productData->precio
            ];

            $data->where = ["id"=>$productData->id];

            if($productData->imagen){
                $data->set["imagen"] = $productData->imagen;
            }

            return $this->db->query($this->buildQuery($data));
        }


        public function checkMarca($name){
            $data = new stdClass();
            $data->method = 'select'; $data->select = ['*']; $data->from = 'marcas';
            $data->where = ['nombre'=>"$name"];

            $q = $this->db->query($this->buildQuery($data));

            if(!$q->num_rows){  
                $data = new stdClass();  
                $data->method = 'insert';
                $data->into = 'marcas (nombre)';
                $data->values = [$name];

                $ins = $this->db->query($this->buildQuery($data));

                return $this->db->insert_id;
            }

            return $q->fetch_assoc()["id"];
        }

        public function getMarcas(){
            $data = new stdClass();
            $data->method = 'select';
            $data->select = ['nombre'];
            $data->from = 'marcas';

            return $this->db->query($this->buildQuery($data))->fetch_all(MYSQLI_ASSOC);
        }

        public function addMarca($name){
            
        }
    }
?>