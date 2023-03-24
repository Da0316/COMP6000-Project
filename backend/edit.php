<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
//target directory for the photo
$target_dir = "uploads/";
//file for the 
$target_file = $target_dir . basename($_FILES["user_image"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

//variables from the edit profile page
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$username = $_POST['username'];
$email = $_POST['email'];
$address = $_POST['address'];
$phone_number = $_POST['phone_number'];
$userID = $_POST['userID'];

///upload image

if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["user_image"]["tmp_name"], $target_file)) {
    $img = $_FILES["user_image"]["tmp_name"];
    // update the profile data
    $query = "UPDATE user SET `firstname` = '$firstname', `lastname` = '$lastname', `username`= '$username', `email` = '$email', `address` = '$address', `phone_number` = '$phone_number',`imageName` ='$target_file' WHERE `userID` = '$userID'";
    $result = $mysqli->query($query);

    //return based on result
    if ($result) {
      echo json_encode('success');
    } else {
      echo json_encode('error');
    }
  } else {
    //update profile data
    $query = "UPDATE user SET `firstname` = '$firstname', `lastname` = '$lastname', `username`= '$username', `email` = '$email', `address` = '$address', `phone_number` = '$phone_number',`imageName` ='' WHERE `userID` = '$userID'";
    $result = $mysqli->query($query);

    //return based on result
    if ($result) {
      echo json_encode('success');
    } else {
      echo json_encode('error');
    }
  }
}


?>