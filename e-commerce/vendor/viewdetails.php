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
    include "../shared/connection.php";

    if(isset($_GET['orderid']))
    {
        $orderid=$_GET['orderid'];
        $userid=$_SESSION['userid'];
        $username=$_SESSION['username'];
        $orderdata=mysqli_query($conn,"SELECT * FROM orders WHERE orderid='$orderid'");
        if(mysqli_num_rows($orderdata)<0)
        {
            echo"<h3>Something went Wrong</h3>";
            die();
        }
    }
    else
    {
        echo"<h4>Something went Wrong</h4>";
        die();
    }
    $data=mysqli_fetch_array($orderdata);

    ?>

    <div class="py-5">
        <div class="container">
            <div class="">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card-header" style="background-color: rgb(200, 100, 250);">
                            <h3>Order Details</h3>
                        </div>
                        <div class="card-body">
                            <div class="col-md-6">
                                <div class="row">
                                <label class="fw-bold md-2">UserId</label>
                                <div class="border p-1">
                                    <?= $data['userid'];?>
                                </div>
                                <label class="fw-bold md-2">Phone</label>
                                <div class="border p-1">
                                    <?= $data['phone'];?>
                                </div>
                                <label class="fw-bold md-2">Address</label>
                                <div class="border p-1">
                                    <?= $data['address'];?>
                                </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price<th>
                                        </tr>                                       
                                    </thead>
                                    
                                    <tbody>
                                        <tr>
                                            <td>
                                            <img src="<?= $data['imgpath']; ?>" alt="<?= $data['pid']; ?>" height="50rem" width="50rem">
                                            <?= $data['name']; ?>
                                            </td>
                                            <td> <?=$data['price']; ?> </td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <label class="fw-bold">Payment Mode</label>  
                            <div class="border p-1 mb-3">
                                Cash on Delivery
                            </div>
                            <label class="fw-bold">Status</label>
                            <div class="mb-3">
                                <form action="status.php" method="POST">
                                    <input type="hidden" name="orderid" value="<?=$data['orderid']?>">
                                    <select name="order_status" id="" class="form-select">
                                        <option value="0" <?=$data['status']==0?"selected":""?> >Out for Delivery</option>
                                        <option value="1" <?=$data['status']==1?"selected":""?> >Delivered</option>
                                        <option value="2" <?=$data['status']==2?"selected":""?> >Cancelled</option>
                                    </select>
                                    <button type="submit" class="mt-2" style="background-color: rgb(200, 150, 250); color: white;" name="update_status_btn">Update Status</button>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
                        
</body>
</html>
