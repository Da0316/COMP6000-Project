<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variables 
$userID = $obj['userID'];

//if userID is set
if (isset($obj['userID']) != ""){
	//gets the username for that userID
    $query = "SELECT username FROM user WHERE userID = " . $userID;
	$result = $mysqli->query($query);
	if ($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);
		//returns username
		echo json_encode($row['username']);
	} else {
		echo json_encode("error");
	}
} else {
    echo json_encode("userID not set");
}
?>