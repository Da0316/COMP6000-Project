<?php
include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	$userID = $obj['userID'];
//echo json_encode("dawd");
if (isset($obj["userID"]) != ""){
    $query = sprintf("SELECT * FROM user WHERE userID = " . $userID,
		$mysqli->real_escape_string($userID)
	);
    $result = $mysqli->query($query);
	//echo json_encode($result);
    if ($result->num_rows > 0){
        $row = mysqli_fetch_assoc($result);
		//echo json_encode($row);
		echo json_encode(array($row['userID'],$row['username'], $row['firstname'], $row['lastname'], $row['date_of_birth'], $row['address'], $row['email'], $row['phone_number']));
    } else {
        echo "user doesn't exist";
    }
} else {	
    echo "error";
}
?>