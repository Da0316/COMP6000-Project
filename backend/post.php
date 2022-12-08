<?php 
include 'config.php';

$json = file_get_contents('php://input');

// decoding the received JSON and store into $obj variable.
$obj = json_decode($json, true);

//storing the data from js
$jobtitle = $obj['jobtitle'];
$jobdetails = $obj['jobdetails'];
$price = $obj['price'];


if ($obj['jobtitle'] != "") {
	$query = sprintf(
		"SELECT * FROM jobs WHERE jobtitle= '%s' limit 1",
		$mysqli->real_escape_string($jobtitle)
	);

	$result = $mysqli->query($query);
	
	$query = sprintf(
		"SELECT * FROM jobs WHERE jobdetails= '%s' limit 1",
		$mysqli->real_escape_string($jobdetails)
	);
	$result1 = $mysqli->query($query);

	if ($result->num_rows > 0 && $result->num_rows > 0) {
		echo json_encode('job already exist');  // alert msg in react native		 		
	} else {
			$query = sprintf(
			"INSERT INTO jobs (job_title,job_description,price) values ('%s','%s','%s')",
			$mysqli->real_escape_string($jobtitle),
			$mysqli->real_escape_string($jobdetails),
			$mysqli->real_escape_string($price),
			
		);

		$result = $mysqli->query($query);
		if ($result) {
			echo  json_encode('Job posted Successfully'); // alert msg in react native
		} else {
			echo json_encode('check internet connection'); // our query fail 		
		}
	}
} else {
	echo json_encode('try again');
}
?>