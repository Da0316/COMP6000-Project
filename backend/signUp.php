<?php 
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

if ($obj['email'] != "") {

	// $result= $mysqli->query("SELECT * FROM users where email='$email'");
	$query = sprintf(
		"SELECT * FROM user WHERE email= '%s' limit 1",
		$mysqli->real_escape_string($email)
	);

	$result = $mysqli->query($query);
	
	$query = sprintf(
		"SELECT * FROM user WHERE username= '%s' limit 1",
		$mysqli->real_escape_string($username)
	);
	$result1 = $mysqli->query($query);

	if ($result->num_rows > 0 && $result->num_rows > 0) {
		echo json_encode('email already exist');  // alert msg in react native		 		
	} else {
		//    $add = $mysqli->query("insert into users (name,email,password) values('$name','$email','$password')");
		//"INSERT INTO user (username,password,firstname,lastname,date_of_birth,address,email,email_verified,phone_number) values ('%s','%s','%s','%s','%s','%s','%s','0','%s')",
		$query = sprintf(
			"INSERT INTO user (username,password,firstname,lastname,date_of_birth,address,email,email_verified,phone_number) values ('%s','%s','%s','%s','%s','%s','%s','0','%s')",
			//"insert into users (name,email,password) values('%s','%s','%s')",
			$mysqli->real_escape_string($username),
			$mysqli->real_escape_string($password),
			$mysqli->real_escape_string($fname),
			$mysqli->real_escape_string($lname),
			$mysqli->real_escape_string($dob),
			$mysqli->real_escape_string($address),
			$mysqli->real_escape_string($email),
			//$mysqli->real_escape_string($email_verified),
			$mysqli->real_escape_string($phone)
			
		);

		$result = $mysqli->query($query);
		if ($result) {
			echo  json_encode('User Registered Successfully, please login'); // alert msg in react native
		} else {
			echo json_encode('check internet connection'); // our query fail 		
		}
	}
} else {
	echo json_encode('try again');
}
?>