<?php
include 'config.php';

$json = file_get_contents('php://input');

// decoding the received JSON and store into $obj variable.
$obj = json_decode($json, true);

//storing the data from js
$taskTitle = $obj['taskTitle'];
$taskDetails = $obj['taskDetails'];
$price = $obj['price'];
$userID = $obj['userID'];
$currentDate = $SYSDATETIME;
$notCompleted = $obj['0'];
$notAccepted = $obj['0'];
//$One = $obj['1'];
//(jobID,userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price)
//datetime for the posted date
//$query = "INSERT INTO jobs (jobID, userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price) VALUES ('" . $jobID . "', '" . $userID . "', '" . $application_date . "', '" . $price_offer . "')";
//$query = "INSERT INTO jobs (job_title,job_description ,price) values ('" . $taskTitle . "','" . $taskDetails . "','" . $price . "')";
$query = "INSERT INTO jobs(userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price)
 		VALUES('1','1','" . $taskTitle . "','" . $taskDetails . "','" . $currentDate . "' , '" . $notAccepted . "'', '" . $notCompleted . "' ,'" . $price . "')";
//= sprintf(
// "INSERT INTO jobs (jobID, userID, specialityID, job_title, job_description, posted_date,job_accepted,job_completed, price)
//  values (NULL,NULL,NULL,'%s','%s',NULL, NULL,NULL,'%s')",
//"INSERT INTO jobs (job_title,job_description,price) VALUES('" . $taskTitle . "','" . $taskDetails . "','" . $price . "')";
//$mysqli->real_escape_string($taskTitle),
//$mysqli->real_escape_string($taskDetails),
//$mysqli->real_escape_string($price),

//);
$result = $mysqli->query($query);

if ($result) {
	echo json_encode('success');
} else {
	echo json_encode('error');
}

// if ($obj['jobT'] != "") {
// 	$query = sprintf(
// 		"SELECT * FROM jobs WHERE jobT= '%s' limit 1",
// 		$mysqli->real_escape_string($jobT)
// 	);

// 	$result = $mysqli->query($query);

// 	$query = sprintf(
// 		"SELECT * FROM jobs WHERE jobD= '%s' limit 1",
// 		$mysqli->real_escape_string($jobD)
// 	);
// 	$result1 = $mysqli->query($query);

// 	if ($result->num_rows > 0 && $result->num_rows > 0) {
// 		echo json_encode('job already exist');  // alert msg in react native		 		
// 	} else {
// 			$query = sprintf(
// 			"INSERT INTO jobs (job_title,job_description ,price) values ('%s','%s','%s')",
// 			$mysqli->real_escape_string($jobT),
// 			$mysqli->real_escape_string($jobD),
// 			$mysqli->real_escape_string($p),

// 		);

// 		$result = $mysqli->query($query);
// 		if ($result) {
// 			echo  json_encode('Job posted Successfully'); // alert msg in react native
// 		} else {
// 			echo json_encode('check internet connection'); // our query fail 		
// 		}
// 	}
// } else {
// 	echo json_encode('try again');
// }
?>