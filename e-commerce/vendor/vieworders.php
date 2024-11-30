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
    ?>

    <div class="py-5">
        <div class="container">
            <div class="">
                <div class="row">
                    <div class="col-md-12">
                    <div class="card-header" style="background-color: rgb(200, 100, 250);">
                            <h3>Orders</h3>
                        </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>User</th>
                                <th>Product Id</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>View</th>
                            </tr>
                        </thead>

                        <tbody>
                        <?php
                        
                        $userid=$_SESSION['userid'];
                        $username=$_SESSION['username'];
                        $orders=mysqli_query($conn,"SELECT * FROM orders WHERE status='0'");
                        
                        if(mysqli_num_rows($orders)>0)
                        {
                            $item=mysqli_fetch_assoc($orders);
                            foreach ($orders as $item)
                            {
                        ?>
                                <tr>
                                    <td> <?=$item['orderid']; ?> </td>
                                    <td> <?=$item['userid']; ?> </td>
                                    <td> <?=$item['pid']; ?> </td>
                                    <td> <?=$item['name']; ?> </td>
                                    <td> <?=$item['price']; ?> </td>
                                    <td> <?=$item['created_date']; ?> </td>
                                    <td> <a href="viewdetails.php?orderid=<?=$item['orderid']; ?>"><button style="background-color:rgb(200, 100, 250); color:white; border-radius:20px">View Details</button></a> </td>
                                </tr>
                        <?php
                            }
                        }
                        else
                        {
                        ?>
                                <tr>
                                    <td colspan="3">No orders yet</td>
                                </tr>
                        <?php
                        }
                        ?>
                        </tbody>
                    </table>

                    </div>
                </div>
            </div>
        </div>
    </div>

    
</body>
</html>
