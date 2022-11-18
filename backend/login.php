<?php include 'config.php';

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$username = $obj['username'];

$password = $obj['password'];

if (isset($obj['username']) != "") {
	
	$query = sprintf(
		"SELECT * FROM user WHERE username= '%s' and password='".$password."' limit 1",
		$mysqli->real_escape_string($username),
		$mysqli->real_escape_string($password)
	);
	
	//print $username;
	$result = $mysqli->query($query);
	$row = mysqli_fetch_assoc($result);
	$userID = $row['userID'];
	if ($result->num_rows == 1) {
		echo json_encode($userID);
	} else {
		echo json_encode(-1);
	}
} else {
	echo json_encode('try again');
}
?>