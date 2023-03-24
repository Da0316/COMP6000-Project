<?php
	//include config
	include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	//json variables
	$search = $obj['searchInput'];
	$id = $obj['id'];
	$filter = $obj['filter'];
	$spec = $obj['specialityID'];
	$query3 = "";
	
	//sets the queries depending on what the inptu fiter types is 
	if($filter == 1){
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%' ORDER BY price ASC";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%' ORDER BY price ASC";
	} else if ($filter == 2){
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%' ORDER BY price DESC";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%' ORDER BY price DESC";
	} else if ($filter == 3){
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%' ORDER BY posted_date DESC";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%' ORDER BY posted_date DESC";
	} else if ($filter == 4){
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%' ORDER BY posted_date ASC";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%' ORDER BY posted_date ASC";
	} else if ($filter == 5){
		$query3 = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE specialityID = '%".$spec."%'";
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%'";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%'";
	}else{
		$query = "SELECT jobID, posted_date, userID, job_completed,  price FROM jobs WHERE job_title LIKE '%".$search."%'";
		$query2 = "SELECT jobID, posted_date, userID, job_completed, price FROM jobs WHERE job_description LIKE '%".$search."%'";
	}
	
	$result = $mysqli->query($query);
	$result2 = $mysqli->query($query2);
	//$query3 will be for specialities.
	if ($query3 != ""){
		$result3 = $mysqli->query($query3);
	}
	$result3 = "";
	//if result is empty return 1 to represent that there was no response.
	if (!$result){
		echo json_encode(1);
	}
	
	//results of the search
	$searchResults = array();
	
	//if there are results
	if ($result->num_rows > 0){
		//loop through results of the first query
		while ($row = mysqli_fetch_assoc($result)){
			//populates array if the userID isnt the user logged in and the job isn't completed 
			if($row['userID'] != $id || $row['job_completed'] != 1){
				array_push($searchResults, $row);
			}
		}
		//loops through results of the second query
		while ($row = mysqli_fetch_assoc($result2)){
			//only pushes the jobID if not already in the array
			if(!in_array($row, $searchResults) && ($row['userID'] != $id || $row['job_completed'] != 1)){
				array_push($searchResults, $row);
			}
		}
		//if query3 exists
		if ($result3 != ""){
			//if results arent empty
			if ($result3-> num_rows > 0){
				//loop through results
				while ($row = mysqli_fetch_assoc($result3)){
					//pushes to the results if userID isnt logged in user and the job hasnt been completed
					if($row['userID'] != $id || $row['job_completed'] != 1){
						array_push($searchResults, $row);
					}
				}
			}
		}
		//return search results
		echo json_encode($searchResults);
	} else{
		//return for error
		echo json_encode(-1);
	}
?>