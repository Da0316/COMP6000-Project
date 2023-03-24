<?php
    //include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

    //return variable and json variables
    $return = '';
    $username = $obj['uName'];

    //gets the image name for that username
    $query = "SELECT imageName FROM user WHERE username = '" . $username . "'";
    $result = $mysqli->query($query);

    //if username exists
    if ($result->num_rows > 0){
        //sets return variable to image name
        $row = mysqli_fetch_assoc($result);
        $return = $row['imageName'];
    }

    //return image name 
    echo json_encode($return);
?>