<?php

$conn=new mysqli("localhost","root","","acme");

if($conn->connect_error)
{
    echo "Connection Failed!, Aborting Execution";
    die;
}

?>