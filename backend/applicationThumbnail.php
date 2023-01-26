<?php
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	$applicationID = $obj['applicationID'];
	
	$query = sprintf(
		"SELECT jobID, application_date, userID, price_offer, status FROM applications WHERE applicationID = '%s'",
		$mysqli->real_escape_string($applicationID)
	);
	
	$result = $mysqli->query($query);
	if ($result->num_rows > 0 ) {
		$row = mysqli_fetch_assoc($result);
		$query2 = "SELECT job_title FROM jobs WHERE jobID = '" . $row['jobID'] . "'";
		$result2 = $mysqli->query($query2);
		if ($result2->num_rows > 0){
			$row2 = mysqli_fetch_assoc($result2);
			$returnArray = array($row['jobID'], $row['application_date'], $row['userID'], $row['price_offer'], $row['status'], $row2['job_title']);
			echo json_encode($returnArray);
		} else {
			json_encode("error");
		}
	} else {
		json_encode("error");
	}
?>