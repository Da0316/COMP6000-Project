<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variables
$jobID = $obj['jobID'];
$userID = $obj['userID'];
$userPostedID = $obj['userPostedID'];
$check = false;

//checks to see if user has left review for the other user on that jobID
$query = "SELECT * FROM reviews WHERE userID = '" . $userID . "' AND jobID = '" . $jobID . "' AND userPostedID = '" . $userPostedID . "'";
$result = $mysqli->query($query);

if (mysqli_num_rows($result) > 0) {
    //sets check to true if one is found
    $check = true;
}
//return check
echo json_encode($check);
?>