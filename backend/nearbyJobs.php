<?php
    //include config    
    include 'config.php';
    $json = file_get_contents('php://input');
    $obj = json_decode($json, true);

    //json variable
    $userID = $obj['userID'];

    //return array
    $jobArray = array();

    //gets all the jobs that aren't accepted or completed, and aren't posted by that userID
    $query = "SELECT jobID, userID FROM jobs WHERE userID != '" . $userID . "' AND job_accepted = '0' AND job_completed = '0'";
    $result = $mysqli->query($query);
    if ($result->num_rows > 0) {
        //loops through all records
        while ($row = mysqli_fetch_assoc($result)){
            //gets the address of the user who posted the job
            $query2 = "SELECT address FROM user WHERE userID = '" . $row['userID'] . "'";
            $result2 = $mysqli->query($query2);
            $row2 = mysqli_fetch_assoc($result2);
            //populates array
            array_push($jobArray, $row['jobID']);
            array_push($jobArray, $row2['address']);
        }
    }

    //return array of data
    echo json_encode($jobArray);
?>