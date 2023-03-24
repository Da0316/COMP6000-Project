<?php
	//include config.php
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	//json variables and return array for applications
	$userID = $obj["id"];
	$returnArray = array();
	
	//gets applicationID's based on userID, and orders it by date
	$query = "SELECT applicationID FROM applications WHERE userID = '" . $userID . "' ORDER BY application_date DESC";
	$result = $mysqli->query($query);
	//if applications exist
	if ($result->num_rows > 0 ) {
		//populate return array
		while ($row = mysqli_fetch_assoc($result)){
			array_push($returnArray, $row["applicationID"]);
		}
		//return array of applicationID's
		echo json_encode($returnArray);
	} else {
		//if not applications exist
		echo json_encode(-1);
	}
?>