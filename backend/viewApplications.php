<?php
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	$applicationID = $obj['applicationID'];
	$query = "SELECT userID, application_date, price_offer FROM applications WHERE applicationID = '" . $applicationID . "'";
	$result = $mysqli->query($query);
	if ($result->num_rows > 0) {
		$row = mysqli_fetch_assoc($result);
		$userID = $row['userID'];
		$query2 = "SELECT username FROM users WHERE userID = '" . $userID . "'";
		$result2 = $mysqli->query($query2);
		if ($result2->num_rows > 0) {
			$row2 = mysqli_fetch_assoc($result2);
			$response = array();
			$response[] = $userID;
			$response[] = $row2['username'];
			$response[] = $row['application_date'];
			$response[] = $row['price_offer'];
			echo json_encode($response);
			//echo json_encode(array($userID, $row2['username'], $row['application_date'], $row['price_offer']));
		} else {
			echo json_encode('error');
		}
	} else {
		echo json_encode('error');
	}
?>