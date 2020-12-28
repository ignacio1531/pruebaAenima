<?php
    require("products.class.php");
    $productos = new products();

    if(!$_GET){
        echo json_encode($productos->getAll());
        return;
    }

    if(isset($_GET["id"])){
        echo json_encode($productos->getById($_GET["id"]));
        return;
    }

?>