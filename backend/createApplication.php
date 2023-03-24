<?php 
	//include config
	include 'config.php';

	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

	//json variables and application date
	$jobID = $obj['jobID'];
	$userID = $obj['userID'];
	$application_date = date('Y-m-d');
	$price_offer = $obj['price_offer'];

	//checks if an application from that user for that job already exists
	$checkQuery = "SELECT applicationID FROM applications WHERE userID = '" . $userID . "' AND jobID = '" . $jobID . "'";
	$checkResult = $mysqli->query($checkQuery);
	
	//if user has already made an application
	if (mysqli_num_rows($checkResult) > 0) {
		$row = mysqli_fetch_assoc($checkResult);
		//update previous application with new price offer
		$query = "UPDATE applications SET price_offer = '" . $price_offer . "', application_date = '" . $application_date . "' WHERE applicationID = '" . $row['applicationID'] . "'";
		$result = $mysqli->query($query);
		//return based on result 
		if ($result) {
			echo json_encode('success');
		} else {
			echo json_encode('error');
		}
	} else {
		//create a new application for that job
		$query = "INSERT INTO applications (jobID, userID, application_date, price_offer, status) VALUES ('" . $jobID . "', '" . $userID . "', '" . $application_date . "', '" . $price_offer . "', '0')";
		$result = $mysqli->query($query);

		//return absed on result
		if ($result){
			echo json_encode('success');
		} else {
			echo json_encode('error');
		}
	}
?>