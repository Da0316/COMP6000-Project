<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
//json variable
$jobID = $obj['jobID'];
//checks if jobID is set
if (isset($obj['jobID']) != ""){
	//gets job data for that jobID
    $query = "SELECT * FROM jobs WHERE jobID = " . $jobID;
    $result = $mysqli->query($query);
	//if it exists
    if ($result->num_rows > 0){
		//gets the username of the user who posted the job
        $row = mysqli_fetch_assoc($result);
		$query2 = "SELECT username FROM user WHERE userID = " . $row['userID'];
		$result2 = $mysqli->query($query2);
		if ($result2->num_rows > 0){
			$row2 = mysqli_fetch_assoc($result2);
			$username = $row2['username'];
		}
		//gets the speciality for the job
		$query3 = "SELECT speciality FROM specialities WHERE specialityID = " . $row['specialityID'];
		$result3 = $mysqli->query($query3);
		if ($result3->num_rows > 0){
			$row3 = mysqli_fetch_assoc($result3);
			$speciality = $row3['speciality'];
		}

		//return array of all data needed for the job
		echo json_encode(array($row['userID'], $speciality, $row['job_title'], $row['job_description'], $row['posted_date'], $row['job_accepted'], $row['job_completed'], $row['price'], $username, $row['imageName']));
    } else {
		//return if job doesn't exist
        echo json_encode("job doesn't exist");
    }
} else {
	//return if job is empty
    echo json_encode("error");
}


?>