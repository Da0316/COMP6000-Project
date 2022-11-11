<?php include 'config.php';

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//$username = isset($_GET['username']);
//$userpassword = isset($_GET['password'];

//$username = mysql_real_escape_string($username);
//$userpassword = mysql_real_escape_string($userpassword); 
$username = $obj['username'];

$password = $obj['password'];

if (isset($obj['username']) != "") {
	//echo json_encode($username);
	//$result= $mysqli->query("SELECT * FROM users where username='$username' and password='$password'");
	//echo($result);
	//$stmt = $mysqli-prepare("SELECT * FROM user WHERE username= 'admin' AND password=(password) limit 1");
	//$stmt->bindParam(':username', $username);
	//$stmt->bindParam(':password', $password);
	
	//$result = $stmt->execute();
	//$mysqli->bindParam(:username, $username);
	//$password->bind_param("%s", $password);
	
	$query = sprintf(
		//"SELECT * FROM user WHERE username= 'admin' and password='123' limit 1",
		"SELECT * FROM user WHERE username= '%s' and password='".$password."' limit 1",
		$mysqli->real_escape_string($username),
		$mysqli->real_escape_string($password)
	);
	
	//print $username;

	$result = $mysqli->query($query);
	//$result->num_rows == 1
	//echo json_encode($query);
	if ($result->num_rows == 1) {
		//echo json_encode($username);
		//echo json_encode($password);
		echo json_encode("ok");
		//echo json_encode($result);
	} else {
		echo json_encode('ddd');
		//echo json_encode($username);
		//echo json_encode($password);
		//echo json_encode($result);
	}
} else {
	echo json_encode('try again');
}