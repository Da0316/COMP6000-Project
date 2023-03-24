<?php
	//include config.php
	include 'config.php';
	$json = file_get_contents('php://input');
	$data = json_decode($json, true);
	
	//json variables and error counter
	$userID = $data['id'];
	$idArray = $data['array'];
	$errorCounter = 0;
	
	//loops through all data in the idArray
	foreach ($idArray as $id){
		//inserts userID and specialityID into table
		$query = "INSERT INTO user_specialities (userID, specialityID) VALUES (" . $userID . ", '" . $id . "')";
		$result = $mysqli->query($query);
		//if failure, increment errorCounter
		if (!$result){
			$errorCounter++;
		}
	}
	if ($errorCounter == 0){
		//return for no errors
		echo json_encode(1);
	} else {
		//return for errors
		echo json_encode(-1);
	}
?>