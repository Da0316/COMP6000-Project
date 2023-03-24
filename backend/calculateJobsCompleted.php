<?php
	// include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	// getting json variables
	$userID = $obj["userID"];
	$count = 0;
	
	// gets all the applications accepted by the user
	$query = "SELECT jobID FROM applications WHERE userID = '" . $userID . "' AND status = '1'";
	$result = $mysqli->query($query);
	// if there are results
	if ($result->num_rows > 0){
		// loop through results
		while ($row = mysqli_fetch_assoc($result)){
			//checks if job has been completed
			$query2 = "SELECT job_completed FROM jobs WHERE jobID = '" . $row['jobID'] . "'";
			$result2 = $mysqli->query($query2);
			$row2 = mysqli_fetch_assoc($result2);
			// increments if job has been completed
			if ($row2['job_completed'] == '1'){
				$count++;
			}
		}
	}
	echo json_encode($count);
?>