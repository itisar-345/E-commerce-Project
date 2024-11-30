<?php

include "../shared/vendor-authguard.php";
include "menu.html";

$userid=$_SESSION['userid'];

// echo "FILE Received Data=";
// print_r($_FILES);

// echo "<br>POST Received Data=";
// print_r($_POST);

$file_name=$_FILES['pdtimg']['name'];
$file_path="../shared/images/".$file_name;

move_uploaded_file($_FILES['pdtimg']['tmp_name'],$file_path);

$name=$_POST['name'];
$price=$_POST['price'];
$detail=$_POST['detail'];

include_once "../shared/connection.php";

$status=mysqli_query($conn,"insert into product(name,price,detail,imgpath,uploaded_by) values('$name',$price,'$detail','$file_path',$userid)");
if($status)
{
    echo "Product Uploaded Successfully!";
    header("location:view.php");
}
else
{
    echo "Failed to Uplaod Product!<br>";
    echo mysqli_error($conn);
}

?>