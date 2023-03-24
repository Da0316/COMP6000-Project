<?php 
//include database config
include 'config.php';

$json = file_get_contents('php://input');

// decoding the received JSON and store into $obj variable.
$obj = json_decode($json, true);

//storing the data from js
$username = $obj['username'];
$fname = $obj['fname'];
$lname = $obj['lname'];
$dob = $obj['dob'];
$address = $obj['address'];
$email = $obj['email'];
$phone = $obj['phone'];
$password = $obj['password'];

//if email exits
if ($obj['email'] != "") {

	//gets all user data for that aemail address
	$query = sprintf(
		"SELECT * FROM user WHERE email= '%s' limit 1",
		$mysqli->real_escape_string($email)
	);

	$result = $mysqli->query($query);
	
	//if email exists, return message
	if ($result->num_rows > 0 ) {
		echo json_encode('email already exist');  // alert msg in react native		 		
	} else {
		//gets users with input username
		$usernameCheck = "SELECT * FROM user WHERE username = '" . $username . "'";
		$usernameResult = $mysqli->query($usernameCheck);
		//if username exists, return message
		if ($usernameResult->num_rows > 0){
			echo json_encode('username already exists');
		} else {
			//insert new user into the database
			$query = sprintf(
				"INSERT INTO user (username,password,firstname,lastname,date_of_birth,address,email,email_verified,phone_number, imageName) values ('%s','%s','%s','%s','%s','%s','%s','0','%s', 'blank')",
				$mysqli->real_escape_string($username),
				$mysqli->real_escape_string($password),
				$mysqli->real_escape_string($fname),
				$mysqli->real_escape_string($lname),
				$mysqli->real_escape_string($dob),
				$mysqli->real_escape_string($address),
				$mysqli->real_escape_string($email),
				$mysqli->real_escape_string($phone)
				
			);
			
			$result = $mysqli->query($query);
			//if the input was successful
			if ($result) {
				//gets the userID of newly entered user and username
				$query2 = "SELECT userID, username FROM user WHERE username = '" . $username . "'";
				$result2 = $mysqli->query($query2);
				$row2 = mysqli_fetch_assoc($result2);
				$array = array($row2['userID'], $row2['username']);
				//return array of userID and username
				echo json_encode($array); // alert msg in react native
			} else {
				//if insert failed
				echo json_encode('check internet connection'); // our query fail 		
			}
		}
	}
} else {
	//error message if email is empty
	echo json_encode('try again');
}
?>