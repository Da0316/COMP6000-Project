<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//return array
$returnArray = array();
//gets all specialities
$query = "SELECT * FROM specialities";
$result = $mysqli->query($query);

//loops through results and populates array
while ($row = mysqli_fetch_assoc($result)){
	array_push($returnArray, $row["specialityID"]);;
	array_push($returnArray, $row["speciality"]);	
}
//return array of specialities
echo json_encode($returnArray);
?>
