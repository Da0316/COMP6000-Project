<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

	//json variables
	$email = $obj['email'];
	$password = $obj['password'];

	//gets the userID for that email
	$query = "SELECT userID FROM user WHERE email = '" . $email . "'";
	$result = $mysqli->query($query);
	//checks if email exists
	if ($result->num_rows > 0) {
		$row = mysqli_fetch_assoc($result);
		$userID = $row["userID"];

		//update password for that userID with new password
		$query2 = "UPDATE user SET password = '" . $password . "' WHERE userID = '" . $userID . "'";
		$result2 = $mysqli->query($query2);

		//return based on result
		if ($result2 == true) {
			echo json_encode("success");
		} else {
			echo json_encode("fail");
		}
	} else {
		//return if email doesn't exist
		echo json_encode("email doesnt exist");
	}

?>