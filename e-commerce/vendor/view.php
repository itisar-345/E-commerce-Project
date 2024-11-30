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
        .del
        {
            background-color: red;
            color: black;
            border-radius: 10px;
            padding: 5px;
            width: 75px;
        }
        .edit
        {
            background-color: gold;
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
    </style>
</head>
<body>
    
        <script>
            function confirmDelete(pid)
            {
                res=confirm("Are you sure you want to Delete?");
                if(res)
                {
                    window.location=`deleteproduct.php?pid=${pid}`;
                }
            }
            function confirmEdit(pid)
            {
                res=confirm("Are you sure you want to Edit?");
                if(res)
                {
                    window.location=`editproduct.php?pid=${pid}`;
                }
            }
        </script>
</body>
</html>
<?php
include_once "../shared/vendor-authguard.php";

$userid=$_SESSION['userid'];
include_once "../shared/connection.php";

$result=mysqli_query($conn,"select * from product where uploaded_by= $userid");

echo "<div class='d-flex flex-wrap'>";
while($row=mysqli_fetch_assoc($result))
{
    $pid=$row['pid'];
    $name=$row['name'];
    $price=$row['price'];
    $detail=$row['detail'];
    $imgpath=$row['imgpath'];

    echo "<div style='padding: 0 45px 60px 0;'>
          <div class='card' style='width: 15rem; height: 35rem'>
            <img class='pdt-img' src='$imgpath' alt='...'>
            <div class='card-body'>
                <h4>$name</h4>
                <h5 style='color: red;'>Rs $price</h5>
                <p class='card-text'>$detail</p>
                <button onclick='confirmDelete($pid)' class='del'>Delete</button>
                <button onclick='confirmEdit($pid)' class='edit'>Edit</button>
            </div>
           </div></div>";
}
echo "</div>";

include "menu.html";

?>