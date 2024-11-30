<?php
include_once "../shared/customer-authguard.php";
include "../shared/connection.php";

if (isset($_POST['placeorderbtn']))
{
    $userid=$_SESSION['userid'];
    
    $phone=$_POST['phone'];
    $address=$_POST['address'];

    if($phone == ""|| $address == "")
    {
        $_SESSION['message'] = "All fields are mandatory";
        header('location:checkout.php');
        exit(0);
    }

    $result=mysqli_query($conn,"select * from cart join product on cart.pid=product.pid  where userid=$userid");
    while($row=mysqli_fetch_assoc($result))
    {
        $cartid=$row['cartid'];
        $pid=$row['pid'];
        $name=$row['name'];
        $price=$row['price'];
        $detail=$row['detail'];
        $imgpath=$row['imgpath'];
        $uploaded_by=$row['uploaded_by'];

        $status=mysqli_query($conn,"insert into orders(userid,pid,name,price,detail,imgpath,uploaded_by,phone,address) values($userid,$pid,'$name',$price,'$detail','$imgpath','$uploaded_by','$phone','$address')");
        if($status)
        {
            echo "$name is added to Order Successfully!<br>";
            header('location:home.php');
        }
}
}

?>