<?php

include "../shared/vendor-authguard.php";
include_once "../shared/connection.php";

if (isset($_POST['update_status_btn']))
{
    $orderid=$_POST['orderid'];
    $order_status=$_POST['order_status'];

    $query=mysqli_query($conn,"UPDATE orders SET status='$order_status' WHERE orderid='$orderid'");
    if($query)
    {
        echo "Order Status Updated Successfully";
        header("location:view.php");
    }
    else
    {
        echo "Update Failed";
        echo mysqli_error($conn);
    }

}