<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$userID = $obj['userID'];
    
    // update the profile data
    $query = "UPDATE users SET firstname = '$firstname', lastname = '$lastname', username = '$username', email = '$email', address = '$address', phone_number = '$phone_number' WHERE id = $userID";
    $result = $mysqli->query($query);

    if ($result) {
	  echo json_encode('success');
    }
    else {
      echo json_encode('error');
    }
  }
  
    // redirect to the profile page
    header('location: profile.php');
  
?>