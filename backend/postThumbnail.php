<?php 
include 'config.php';
	
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	$jobID = $obj['jobID'];
	
	//$jobDescription = $obj['job_description'];
	
	//if (isset($obj['jobID']) != ''){
		$query = sprintf(
			"SELECT * FROM jobs WHERE jobID= '%s'",
			$mysqli->real_escape_string($jobID)
			//$mysqli->real_escape_string($jobDescription)
			);
		
		$result = $mysqli->query($query);
		/*$rows = array();
		//mysqli_fetch_assoc($result);
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
			//echo json_encode[$r];
		}*/
		$row = mysqli_fetch_assoc($result);
		$r = array($row['jobID'], $row['job_title'],$row['job_description'], $row['price']);
		echo json_encode($r);
		//echo json_encode($row['userID']);
		if ($result->num_rows == 1) {
		//echo json_encode($row[0]);
		} else {
			echo json_encode(-1);
		}
		//} else {
		//	echo json_encode('try again');
		
	
	//}
	
	

?>