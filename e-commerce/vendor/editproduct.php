<!DOCTYPE html>
<html lang="en">
<head>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
 
</head>
<body>

<?php
include_once "../shared/vendor-authguard.php";
include "menu.html";

$userid=$_SESSION['userid'];
$pid=$_GET['pid'];

include_once "../shared/connection.php";

$result=mysqli_query($conn,"select * from product");

if(mysqli_num_rows($result)>0)
{
    $row=mysqli_fetch_assoc($result);

    ?>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form enctype="multipart/form-data" action="edit.php" method="post" class="w-50 p-3" style="background-color: rgb(200, 60, 255);">

            <input type="hidden" name="pid" value="<?= $row['pid'];?>">
            <input required class="form-control mt-2" value="<?= $row['name'];?>" type="text" name="name" placeholder="Product Name">
            <input required class="form-control mt-2" value="<?= $row['price']; ?>" type="number" name="price" placeholder="Product Price">
            <textarea required class="form-control mt-2" name="detail" id="" cols="30" rows="5"><?= $row['detail']; ?></textarea>

            <input type="hidden" name="old_image" value="<?= $row['imgpath']; ?>">
            <label>Current Image</label>
            <img src="<?= $row['imgpath']; ?>" alt="Product Image" height="50px" width="50px">
            <input class="form-control mt-2" name="pdtimg" type="file" accept=".jpg">
            
            <div class="text-center">
                <button class=" mt-3" style="background-color:purple; color: white;" name="updatebtn">Update</button>
            </div>
        </form>
     </div>
    <?php
}
else
{
    echo "Product Not Found for given Id";
}
?>

</body>
</html>