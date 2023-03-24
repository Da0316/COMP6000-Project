<?php
//include config 
include 'config.php';
$errorCounter = 0;
//post vaiables
$userID = $_POST['userID'];
$rating = $_POST['rating'];
$review_text = $_POST['review_text'];
$jobid = $_POST['jobid'];
$userposted = $_POST['userposted'];

//enters new review
$query = "INSERT INTO `reviews`( `userID`, `rating`, `review_text`, `jobid`,`userPostedID`) VALUES ('$userID','$rating','$review_text','$jobid','$userposted')";
$result = $mysqli->query($query);
//if error occured
if (!$result) {
	$errorCounter++;
}
//return based on if an error occured or not
if ($errorCounter == 0) {
	echo json_encode(1);
} else {
	echo json_encode(-1);
}
?>