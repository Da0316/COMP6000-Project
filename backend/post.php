<?php
include 'config.php';

$json = file_get_contents('php://input');

$obj = json_decode($json, true);

$taskT = $obj['taskT'];
$taskD = $obj['taskD'];
$p = $obj['p'];
$ID = $obj['ID'];
$speciality = $obj['speciality'];

$date = date('Y-m-d H:i:s');

$specialityQuery = "SELECT specialityID FROM specialities WHERE speciality = '" . $speciality. "'";
$result = $mysqli->query($specialityQuery);
$row = mysqli_fetch_assoc($result);
$specialityID = $row["specialityID"];

$query = "INSERT INTO jobs (userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price)
 		VALUES('" . $ID . "', '" . $specialityID . "', '" . $taskT . "', '" . $taskD . "', '" . $date . "', '0', '0', '" . $p . "')";

$result1 = $mysqli->query($query);

if ($result1) {
	echo json_encode(1);
} else {
	echo json_encode(-1);
}

?>