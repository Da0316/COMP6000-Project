<?php
//this file gets the most recently posted jobs in order and returns the ID to the react code
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variable
$userID = $obj['id'];

//gets all the jobID's and completed status which arent posted by specified user, order it by date posted and limit to 50 
$query = "SELECT jobID, job_completed FROM jobs WHERE userID != '" . $userID . "' ORDER BY posted_date DESC LIMIT 50";

$result = $mysqli->query($query);

//return array
$data = array();

// Loop through the result and add each row to the array
if ($result->num_rows > 0) {
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}
}

//retrun array of jobs
echo json_encode($data);

?>