<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$userID = $obj['userID'];

// check if the form has been submitted
if (isset($_POST['submit'])) {
  // retrieve the form data
  $firstname = $_POST['firstname'];
  $lastname = $_POST['lastname'];
  $username = $_POST['username'];
  $email = $_POST['email'];
  $address = $_POST['address'];
  $ = $_POST['address'];

  // validate the form data
  if (empty($firstname)) {
    $error = 'Please enter your firstname';
  } else if (empty($lastname)) {
    $error = 'Please enter your lastname';
  } else if (empty($email)) {
    $error = 'Please enter a valid email address';
  } else if (empty($username)) {
    $error = 'Please enter a your username';
  } else if (empty($address)) {
    $error = 'Please enter your email';
  } else if (empty($phone_number)) {
    $error = 'Please enter your phone_number';
  } else {
    

    // update the profile data
    $query = "UPDATE users SET firstname = '$firstname', lastname = '$lastname', username = '$username', email = '$email', address = '$address', phone_number = '$phone_number' WHERE id = $userID";
    mysqli_query($db, $query);

    // redirect to the profile page
    header('location: profile.php');
  }
}

?>