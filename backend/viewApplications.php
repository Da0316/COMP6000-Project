<?php
	//include database config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	//json variable
	$applicationID = $obj['applicationID'];
	//gets application data for that applicationID
	$query = "SELECT userID, application_date, price_offer FROM applications WHERE applicationID = '" . $applicationID . "'";
	$result = $mysqli->query($query);
	//if application exists
	if ($result->num_rows > 0) {
		$row = mysqli_fetch_assoc($result);
		$userID = $row['userID'];
		//gets the username for the user of the application
		$query2 = "SELECT username FROM users WHERE userID = '" . $userID . "'";
		$result2 = $mysqli->query($query2);
		if ($result2->num_rows > 0) {
			//populates return array
			$row2 = mysqli_fetch_assoc($result2);
			$response = array();
			$response[] = $userID;
			$response[] = $row2['username'];
			$response[] = $row['application_date'];
			$response[] = $row['price_offer'];
			//return array of data
			echo json_encode($response);
		} else {
			//if user doesnt exist 
			echo json_encode('error');
		}
	} else {
		//if application doenst exist
		echo json_encode('error');
	}
?>