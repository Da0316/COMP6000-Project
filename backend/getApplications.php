<?php
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	$userID = $obj["id"];
	$returnArray = array();
	$query = "SELECT applicationID FROM applications WHERE userID = '" . $userID . "' ORDER BY application_date DESC";
	$result = $mysqli->query($query);
	if ($result->num_rows > 0 ) {
		while ($row = mysqli_fetch_assoc($result)){
			array_push($returnArray, $row["applicationID"]);
		}
		echo json_encode($returnArray);
	} else {
		echo json_encode(-1);
	}
?>