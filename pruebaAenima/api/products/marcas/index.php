<?php 
    require("../products.class.php");
    $productos = new products();

    echo json_encode($productos->getMarcas());
?>