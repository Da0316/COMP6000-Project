<?php
	//incldue database config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

	//json variables and return array
	$jobID = $obj["id"];
	$returnArray = array();
	//gets the applicationID and status of application for that specific job
	$query = "SELECT applicationID, status FROM applications WHERE jobID = '" . $jobID . "' ORDER BY status DESC";
	$result = $mysqli->query($query);

	//if jobs exist
	if ($result->num_rows > 0) {
		//populate array
		while ($row = mysqli_fetch_assoc($result)){
			array_push($returnArray, $row["applicationID"]);
			array_push($returnArray, $row["status"]);
		}
		//retrun array of data
		echo json_encode($returnArray);
	} else {
		//if no applications exist
		echo json_encode(-1);
	}
?>