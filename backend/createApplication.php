<?php include 'config.php';

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$jobID = $obj['jobID'];
$userID = $obj['userID'];
$application_date = date('Y-m-d');
$price_offer = $obj['price_offer'];

$query = "INSERT INTO applications (jobID, userID, application_date, price_offer) VALUES ('" . $jobID . "', '" . $userID . "', '" . $application_date . "', '" . $price_offer . "')";
$result = $mysqli->query($query);

if ($result){
	echo json_encode('success');
} else {
	echo json_encode('error');
}
?>