<?php include 'config.php';

$json = file_get_contents('php://input');

// decoding the received JSON and store into $obj variable.
$obj = json_decode($json, true);

// name store into $name.
$name = $obj['name'];

// same with $email.
$email = $obj['email'];

// same with $password.
$password = $obj['password'];

if ($obj['email'] != "") {

	// $result= $mysqli->query("SELECT * FROM users where email='$email'");
	$query = sprintf(
		"SELECT * FROM users WHERE email= '%s' limit 1",
		$mysqli->real_escape_string($email)
	);

	$result = $mysqli->query($query);

	if ($result->num_rows > 0) {
		echo json_encode('email already exist');  // alert msg in react native		 		
	} else {
		//    $add = $mysqli->query("insert into users (name,email,password) values('$name','$email','$password')");
		$query = sprintf(
			"insert into users (name,email,password) values('%s','%s','%s')",
			$mysqli->real_escape_string($name),
			$mysqli->real_escape_string($email),
			$mysqli->real_escape_string($password)
		);

		$result = $mysqli->query($query);
		if ($add) {
			echo  json_encode('User Registered Successfully'); // alert msg in react native
		} else {
			echo json_encode('check internet connection'); // our query fail 		
		}
	}
} else {
	echo json_encode('try again');
}