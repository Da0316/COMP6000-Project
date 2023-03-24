<?php
	// include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

	// get json variables
	$choice = $obj['choice'];
	$newPrice = $obj['priceOffer'];
	$applicationID = $obj['applicationID'];

	// if application is accepted
	if ($choice == 'Accept'){
		$query = "UPDATE applications SET status = '1' WHERE applicationID = '" . $applicationID . "'";

	//if application is rejected
	} else if ($choice == 'Reject'){
		$query = "UPDATE applications SET status = '-1' WHERE applicationID = '" . $applicationID . "'";
	}

	$result = $mysqli->query($query);
	
	// if query is successful
	if ($result) {
		if ($choice == 'Accept'){
			// edits jobs table to mark job as accepted
			$query2 = "SELECT jobID FROM applications WHERE applicationID = '" . $applicationID . "'";
			$result2 = $mysqli->query($query2);
			$row2 = mysqli_fetch_assoc($result2);
			$query3 = "UPDATE jobs SET job_accepted = '1', price = '" . $newPrice . "' WHERE jobID = '" . $row2['jobID'] . "'";
			$result3 = $mysqli->query($query3);

			//if successful
			if ($result3){
				echo json_encode(1);
			} else {
				//error
				echo json_encode(-1);
			}
		} else {
			// if rejection is successful
			echo json_encode(1);
		}
	} else {
		//error
		echo json_encode(-1);
	}
?>