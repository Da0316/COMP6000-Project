<?php
	//include database config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	//json variable
	$userID = $obj['id'];
	
	//set arrays
	$specialityIDs = array();
	$jobIDs = array();

	//get all the specialityID's the user has
	$query = "SELECT specialityID FROM user_specialities WHERE userID = '" . $userID . "'";
	$result = $mysqli->query($query);
	
	//if it exist
	if ($result->num_rows > 0){
		//populate specialityID's array
		while($row = $result->fetch_assoc()){
			$specialityIDs[] = $row['specialityID'];
		}
		//gets all the job's the user hasnt posted
		$query2 = "SELECT jobID, specialityID, job_completed FROM jobs WHERE userID != '" . $userID . "'";
		$result2 = $mysqli->query($query2);
		//if they exist
		if ($result2->num_rows > 0){
			//loop through jobs
			while ($row2 = mysqli_fetch_assoc($result2)){
				//loop through the user specialities
				foreach ($specialityIDs as $x){
					// if the job has the same speciality, and isn't completed
					if ($row2['specialityID'] == $x && $row2['job_completed'] != 1){
						//populate array
						array_push($jobIDs, $row2['jobID']);
					}
				}
			}
			//shuffle array
			shuffle($jobIDs);
			//return array 
			echo json_encode($jobIDs);
		}
	}
?>