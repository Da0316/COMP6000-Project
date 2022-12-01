<?php include config.php
	
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	$jobID = $obj['jobID'];
	
	if (isset($obj['jobID']) != ''){
		$query = sprintf(
		"SELECT * FROM jobs");
		
		$result = $mysqli->query($query);
		$row = mysqli_fetch_assoc($result);
		if ($result->num_rows == 1) {
			echo json_encode($result);
		} else {
			echo json_encode(-1);
		}
	} else {
		echo json_encode('try again');
		
	
	}
	
	

?>