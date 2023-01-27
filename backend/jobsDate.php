<?php
//this file gets the most recently posted jobs in order and returns the ID to the react code
include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	$query = sprintf(
		"SELECT jobID FROM jobs ORDER BY posted_date DESC",
	);
	
	$result = $mysqli->query($query);
	$j1 = mysqli_fetch_assoc($result);
	$j2 = mysqli_fetch_assoc($result);
	$j3 = mysqli_fetch_assoc($result);
	$r = array($j1['jobID'], $j2['jobID'], $j3['jobID']);
	//$r = array();
	
	//for ($x =0; $x <=6; $x++){
	//	$j1 = mysqli_fetch_assoc($result);
	//	array_push($r, $j1['jobID'])
	//	echo json_encode($r);
	//}
	echo json_encode($r);
	//check if job has already been completed 
	//its not the current users job
	
?>
