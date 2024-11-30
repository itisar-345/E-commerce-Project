<?php
include_once "../shared/vendor-authguard.php";

$userid=$_SESSION['userid'];
$pid=$_GET['pid'];

//echo "Received id=$pid";

include_once "../shared/connection.php";

$status=mysqli_query($conn,"DELETE FROM product WHERE `product`.`pid` = $pid");
if($status)
{
    echo "Product Deleted Successfully!";
    header("location:view.php");
}
else
{
    echo "Delete Failed";
    echo mysqli_error($conn);
}


?>