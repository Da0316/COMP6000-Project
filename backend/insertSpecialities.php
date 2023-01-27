<?php
	include 'config.php';
	$json = file_get_contents('php://input');
	$data = json_decode($json, true);
	
	$userID = $data['id'];
	$idArray = $data['array'];
	$errorCounter = 0;
	
	foreach ($idArray as $id){
		//echo $id;
		$query = "INSERT INTO user_specialities (userID, specialityID) VALUES (" . $userID . ", '" . $id . "')";
		$result = $mysqli->query($query);
		if (!$result){
			$errorCounter++;
		}
	}
	//echo $errorCounter;
	if ($errorCounter == 0){
		echo json_encode(1);
	} else {
		echo json_encode(-1);
	}
?>