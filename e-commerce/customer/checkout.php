<!DOCTYPE html>
<html lang="en">
<head>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
 
</head>
<body>

    <div class="py-5">
        <div class="container">
            <div class="">
                <form action="placeorder.php" method="post">
                <div class="row">
                    <div class="col-md-12">

                    <div class="card-header">Details</div>
                    <div class="card-body">
                        <div class="col-md-6">
                            <div class="row">
                            <input required class="form-control mt-2" type="number" name="phone" placeholder="Phone no.">
                            <textarea required class="form-control mt-2" name="address" id="" placeholder="Address" cols="30" rows="5"></textarea>
                            <a href='placeorder.php?cartid=$cartid'><button style="background-color:blue; color:white; border-radius:20px" name="placeorderbtn">Place Order</button></a>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
                </form>
            </div>
        </div>
    </div>

</body>
</html>