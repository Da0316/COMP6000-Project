<?php
//include database config	
include 'config.php';

$json = file_get_contents('php://input');

$obj = json_decode($json, true);

//json variables
$taskT = $obj['taskT'];
$taskD = $obj['taskD'];
$p = $obj['p'];
$ID = $obj['ID'];
$speciality = $obj['speciality'];

//todays date
$date = date('Y-m-d H:i:s');

//last json variable
$image = $obj['image'];

//gets the specialityID of the speciality selected
$specialityQuery = "SELECT specialityID FROM specialities WHERE speciality = '" . $speciality. "'";
$result = $mysqli->query($specialityQuery);
$row = mysqli_fetch_assoc($result);
$specialityID = $row["specialityID"];

//inserts new jbo into the database with all the data
$query = "INSERT INTO jobs (userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price, imageName)
 		VALUES('" . $ID . "', '" . $specialityID . "', '" . $taskT . "', '" . $taskD . "', '" . $date . "', '0', '0', '" . $p . "','". $image . "')";

$result1 = $mysqli->query($query);

if ($result1) {
	//return if successful
	echo json_encode(1);
} else {
	//return if not successful
	echo json_encode(-1);
}

?>