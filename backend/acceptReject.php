<?php
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	$choice = $obj['choice'];
	$applicationID = $obj['applicationID'];
	if ($choice == 'Accept'){
		$query = "UPDATE applications SET status = '1' WHERE applicationID = '" . $applicationID . "'";
	} else if ($choice == 'Reject'){
		$query = "UPDATE applications SET status = '-1' WHERE applicationID = '" . $applicationID . "'";
	}
	$result = $mysqli->query($query);
	
	if ($result) {
		echo json_encode(1);
	} else {
		echo json_encode(-1);
	}
?>