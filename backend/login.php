<?php
//include config
include 'config.php';

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variables 
$username = $obj['username'];
$password = $obj['password'];

//if username is set
if (isset($obj['username']) != "") {

	//gets records for specified username and password, limit to 1
	$query = sprintf(
		"SELECT * FROM user WHERE username= '%s' and password='" . $password . "' limit 1",
		$mysqli->real_escape_string($username),
		$mysqli->real_escape_string($password)
	);
	$result = $mysqli->query($query);
	//if record exists
	if ($result->num_rows == 1) {
		//return userID
		$row = mysqli_fetch_assoc($result);
		$userID = $row['userID'];
		echo json_encode($userID);
	} else {
		//return if it doesn't exist
		echo json_encode(-1);
	}
} else {
	//return if username doesnt exist
	echo json_encode('try again');
}
?>