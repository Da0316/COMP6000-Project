<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

	//json variables and return array
	$userID = $obj["id"];
	$returnArray = array();

	//gets jobID's for the userID ordered by date posted
	$query = "SELECT jobID FROM jobs WHERE userID = '" . $userID . "' ORDER BY posted_date DESC";
	$result = $mysqli->query($query);
	if ($result->num_rows > 0 ) {
		//populate array
		while ($row = mysqli_fetch_assoc($result)){
			array_push($returnArray, $row["jobID"]);
		}
		//return array of data
		echo json_encode($returnArray);
	} else {
		//if no jobs exist
		echo json_encode(-1);
	}
?>