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

    $userid=$_SESSION['userid'];
    $username=$_SESSION['username'];
    $usertype=$_SESSION['usertype'];
    echo "<div class='auth-parent'>
        <div>$userid</div>
        <div>$username</div>
        <div>$usertype</div>
    </div>";

?>