<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	$return = 'error';
	//json variable
	$username = $obj['username'];
	
	//gets the userID given the username
	$query = "SELECT userID from user WHERE username = '" . $username . "'";
	$result = $mysqli->query($query);
	
	if ($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);
		$return = $row['userID'];
	}
	//return either error if failure or userID if successful
	echo json_encode($return);
?>