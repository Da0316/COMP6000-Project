<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	//get json variables
	$applicationID = $obj['applicationID'];
	
	//query to get application details
	$query = sprintf(
		"SELECT jobID, application_date, userID, price_offer, status FROM applications WHERE applicationID = '%s'",
		$mysqli->real_escape_string($applicationID)
	);
	
	$result = $mysqli->query($query);
	//if there are results
	if ($result->num_rows > 0 ) {
		$row = mysqli_fetch_assoc($result);
		//get job details
		$query2 = "SELECT job_title, imageName FROM jobs WHERE jobID = '" . $row['jobID'] . "'";
		$result2 = $mysqli->query($query2);
		//if there are results
		if ($result2->num_rows > 0){
			$row2 = mysqli_fetch_assoc($result2);
			//return details needed
			$returnArray = array($row['jobID'], $row['application_date'], $row['userID'], $row['price_offer'], $row['status'], $row2['job_title'], $row2['imageName']);
			echo json_encode($returnArray);
		} else {
			// return error
			echo json_encode("error");
		}
	} else {
		// return error
		echo json_encode("error");
	}
?>