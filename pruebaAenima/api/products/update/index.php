<?php
    if(!$_POST)return;
    require("../products.class.php");
    $productos = new products();

    $requiredFields = ["id","nombre", "marca", "descripcion", "precio"];

    $continue = true;

    $productData = new stdClass();

    foreach($requiredFields as $field){
        if(!isset($_POST[$field])){
             $continue = false;
             break;
        } else {
            $productData->$field = $_POST[$field];
        }
    }

    if(!$continue) return;

    if(isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] == 0){
        if (strpos($_FILES["imagen"]["type"], 'image') === false) {
            $productData->imagen = false;
        } else {
            $tempLocation = $_FILES["imagen"]["tmp_name"];
            $name = $_FILES["imagen"]["size"] . $_FILES["imagen"]["name"];
            $newLocation = __DIR__ . "/../../../assets/images/";
            move_uploaded_file ($tempLocation, $newLocation.$name);
            $productData->imagen = $name;
        }
    } else {
        $productData->imagen = false;
    }

    echo $productos->update($productData);
?>