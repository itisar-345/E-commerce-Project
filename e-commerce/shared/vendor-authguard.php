<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .dropdown
        {
            position:fixed;
            top: 60px;
            right: 5px;
            width: fit-content;
        }
        .dropdown-items
        {
            display: none;
            text-align: center;
            text-decoration: solid;
            border-width: 3px;
            color: white;
        }
        .dropdown:hover .dropdown-items
        {
            display: block;
            position: relative;
            background-color: rgb(200, 60, 255);
            padding: 10px;
            gap: 10px;
        }
        .btn
        {
            position: fixed;
            top: 5px;
            right: 5px;
            border-width: 3px;
            border-radius: 100px;
            border-color:  rgb(225, 100, 255);
            font-style: italic;
            font-weight: bold;
            font-style: gray;
            background-color: white;
            color: rgb(200, 60, 255);
            padding: 15px;
        }
    </style>
</head>
<body>
    
</body>
</html>

<?php
    session_start();
    if(!isset($_SESSION['login_status']))
    {
        echo "Illegal attempt";
        die;
    }
    if($_SESSION['login_status']==false)
    {
        echo "Login Failed; Unauthorised Attempt";
        die;
    }
    if($_SESSION['usertype']!='vendor')
    {
        echo "Unauthorized USER Type";
        die;
    }

    $userid=$_SESSION['userid'];
    $username=$_SESSION['username'];
    $usertype=$_SESSION['usertype'];

    echo "<div class='dropdown'>
        <button class='btn'>Profile</button>
        <div class='dropdown-items'>
            <div class='item'>$username</div>
            <div class='item'>$userid</div>
            <div class='item'>$usertype</div>
        </div>
     </div>";

?>