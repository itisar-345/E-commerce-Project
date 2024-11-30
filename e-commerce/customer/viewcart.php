<!DOCTYPE html>
<html lang="en">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <meta name="viewport" content="width=device-width, intial-scale=1">
    <style>
        .card
        {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
            grid-auto-rows: auto;
            grid-gap: 1rem;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            transition: 0.3s;
            width: 40%;
            border-radius: 5px;
        }
        .card :hover
        {
            box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
        }
        .card-body
        {
            padding: 5px 10px;
        }
        .card-text
        {
            height:30px;      
            overflow:hidden;      
        }
        .cart
        {
            background-color: red;
            color: black;
            border-radius: 10px;
            padding: 5px;
            width: 75px;
        }
        .pdt-img
        {
            width:15rem;
            height:15rem;
            border-radius: 5px 5px 0 0;
        }
        .place
        {
            background-color: green; 
            color: white;
            width: 15%;
            padding: 10px;
            margin: 15px;
            border-radius: 50px;
        }
    </style>
</head>
<body>
</body>
</html>

<?php
include_once "../shared/customer-authguard.php";
$userid=$_SESSION['userid'];
include "../shared/connection.php";

$total=0;
$result=mysqli_query($conn,"select * from cart join product on cart.pid=product.pid  where userid=$userid");

echo "<div class='d-flex flex-wrap'>";
while($row=mysqli_fetch_assoc($result))
{
    $cartid=$row['cartid'];
    $pid=$row['pid'];
    $name=$row['name'];
    $price=$row['price'];
    $detail=$row['detail'];
    $imgpath=$row['imgpath'];

    $total=$total+$price;

    echo "<div style='padding: 0 45px 45px 0;'> 
            <div class='card' style='width: 15rem; height: 35rem;'>
            <img class='pdt-img' src='$imgpath' alt='...'>
            <div class='card-body'>
                <h4>$name</h4>
                <h5 style='color: rgb(255, 110, 150);'>Rs $price</h5>
                <p class='card-text'>$detail</p>
                <a href='deletecart.php?cartid=$cartid'><button class='cart'>Remove from Cart</button></a>
            </div>
         </div></div>";
}

echo "</div>";

echo "<div style='padding: 0 0 75px 0;'>
       <div class='place-order gap-3 bg-primary w-25'>
        <div class='display-5 text-white'>Total: Rs.$total</div>
       </div>
        <a href='checkout.php'><button class='place'>Check Out</button></a>
      </div>";

include "menu.html";

?>