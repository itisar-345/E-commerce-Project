<?php

$cartid=$_GET['cartid'];
include "../shared/connection.php";

$status=mysqli_query($conn,"delete from cart where cartid=$cartid");
if($status)
{
    echo "Item removed from Cart successfully!!";
    header("location:viewcart.php");
}
else
{
    echo "Error in removing the cart Item!";
    echo mysqli_error($conn);
}


?>