<?php

include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$returnArray = array();
// if (isset($obj["userID"]) != "") {
$query = "SELECT * FROM specialities";
$result = $mysqli->query($query);
$counter = 0;
while ($row = mysqli_fetch_assoc($result)){
	array_push($returnArray, $row["specialityID"]);;
	array_push($returnArray, $row["speciality"]);	
}
echo json_encode($returnArray);

?>
