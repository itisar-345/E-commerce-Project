<!DOCTYPE html>
<html lang="en">
<head>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
 
</head>
<body>

    <div class="d-flex justify-content-center align-items-center vh-100">
        <form enctype="multipart/form-data" action="upload.php" method="post" class="w-25 p-3" style="background-color: rgb(200, 60, 255);">

            <input required class="form-control mt-2" type="text" name="name" placeholder="Product Name">
            <input required class="form-control mt-2" type="number" name="price" placeholder="Product Price">
            <textarea required class="form-control mt-2" name="detail" id="" cols="30" rows="5"></textarea>

            <input required class="form-control mt-2" name="pdtimg" type="file" accept=".jpg">

            <div class="text-center">
                <button class=" mt-3" style="background-color:purple; color: white;" >Upload</button>
            </div>
        </form>
     </div>

</body>
</html>

<?php
include "../shared/vendor-authguard.php";   
include "menu.html";
?>