<?php

include "../shared/vendor-authguard.php";
include_once "../shared/connection.php";

if (isset($_POST['updatebtn']))
{
    $userid=$_SESSION['userid'];
    $pid=$_GET['pid'];
    
    $name=$_POST['name'];
    $price=$_POST['price'];
    $detail=$_POST['detail'];

    $file_name=$_FILES['pdtimg']['name'];
    $file_path="../shared/images/".$file_name;

    move_uploaded_file($_FILES['pdtimg']['tmp_name'],$file_path);

    $new_image=$_FILES['pdtimg']['name'];
    $old_image=$_POST['old_image'];

    if($new_image!= "")
    {
        $image_ext=pathinfo($new_image, PATHINFO_EXTENSION);
        $update_filename=time().'.'.$image_ext;
    }
    else
    {
        $update_filename=$old_image;
    }
    $file_path="../shared/images/".$update_filename;

    $query=mysqli_query($conn,"UPDATE product SET name='$name',price='$price',detail='$detail',imgpath='$file_path' WHERE pid='$pid' ");
    if($query)
    {
        if($_FILES['pdtimg']['name'] != "")
        {
            move_uploaded_file($_FILES['pdtimg']['name'], $path.'/'.$update_filename);
            if(file_exists("../shared/images/".$old_image))
            {
                unlink("../shared/images/".$old_image);
            }
        }
        echo "Product Updated Successfully";
        header("location:view.php");
    }
    else
    {
        echo "Update Failed";
        echo mysqli_error($conn);
    }

}
else
{
    echo "Update Failed";
    echo mysqli_error($conn);
}

?>