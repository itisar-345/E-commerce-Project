<?php

$uname=$_POST['username'];
$upass=$_POST['pass1'];

$cipher_text=md5($upass);

include_once "../shared/connection.php";

$status=mysqli_query($conn,"insert into user(username,password,usertype) values('$uname','$cipher_text','customer')");

if($status)
{
    echo "Registration Done Successfully!";
}
else
{
    echo "Registartion Failed<br>";
    echo mysqli_error($conn);
}

?>