<?php
//include config
include 'config.php';

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variables
$jobID = $obj['jobID'];

//gets the job information for that job
$query = sprintf(
	"SELECT * FROM jobs WHERE jobID= '%s'",
	$mysqli->real_escape_string($jobID)
);

$result = $mysqli->query($query);

if ($result->num_rows == 1) {
	$row = mysqli_fetch_assoc($result);
	//creates new return array
	$r = array($row['jobID'], $row['job_title'], $row['job_description'], $row['price'], $row['imageName']);
	//return array
	echo json_encode($r);
} else {
	//return if error
	echo json_encode(-1);
}

?>