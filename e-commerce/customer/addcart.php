<?php

include_once "../shared/customer-authguard.php";

$userid=$_SESSION['userid'];
$pid=$_GET['pid'];

include "../shared/connection.php";

$status=mysqli_query($conn,"insert into cart(userid,pid) values($userid,$pid)");
if($status)
{
    echo "Product Added to Cart Successfully!";    
    header("location:viewcart.php");
}
else
{
    echo "Unable to add to cart";
    echo mysqli_error($conn);
}

?>