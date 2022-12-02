<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$jobID = $obj['jobID'];

if (isset($obj["jobID"]) != ""){
    $query = "SELECT * FROM jobs WHERE jobID = " . $jobID;
    $result = $mysqli->query($query);
    if ($result->num_rows > 0){
        $row = mysqli_fetch_assoc($result);
		echo json_encode(array($row['userID'], $row['specialityID'], $row['job_title'], $row['job_description'], $row['posted_date'], $row['job_accepted'], $row['job_completed'], $row['price']));
    } else {
        echo "job doesn't exist";
    }
} else {
    echo "error";
}


?>