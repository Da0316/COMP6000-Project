<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	//json variable and return
	$jobID = $obj["jobID"];
	$return = -1;
	//update job the be complete
	$query = "UPDATE jobs SET job_completed = '1' WHERE jobID = '" . $jobID . "'";
	$result = $mysqli->query($query);
	
	//changes return if successful
	if ($result) {
		$return = 1;
	} 
	//return 
	echo json_encode($return);
?>