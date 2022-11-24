<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$userID = $obj['userID'];

if (isset($obj['userID']) != ""){
    $query = "SELECT username FROM user WHERE userID = " . $userID;
	$result = $mysqli->query($query);
	if ($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);
		echo json_encode($row['username']);
	}
} else {
    echo "error";
}
?>