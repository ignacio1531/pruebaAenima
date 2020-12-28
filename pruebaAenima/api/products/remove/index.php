<?php
    if(!$_GET || !isset($_GET["id"]))return;
    require("../products.class.php");
    $productos = new products();

    echo $productos->remove($_GET["id"]);
?>