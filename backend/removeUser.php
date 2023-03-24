<?php
    //incldue config
    include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

    //json variable and return variable
    $jobID = $obj["jobID"];
    $message = "";

    //sets the job to not accepted
    $query = "UPDATE jobs SET job_accepted = '0' WHERE jobID = '" . $jobID . "'";
    $result = $mysqli->query($query);
    //if successful
    if ($result){
        //gets the application to be removed for that job
        $query2 = "SELECT applicationID FROM applications WHERE jobID = '" . $jobID . "' AND status = '1'";
        $result2 = $mysqli->query($query2);
        if ($result2->num_rows > 0){
            //update the job to be rejected
            $row2 = mysqli_fetch_assoc($result2);
            $query3 = "UPDATE  applications SET status = '-1' WHERE applicationID = '" . $row2['applicationID'] . "'";
            $result3 = $mysqli->query($query3);
            //if successful
            if ($result3){
                $message = "success";
            } else {
                $message = "error";
            }
        } else {
            $message = "error";
        }
    } else {
        $message = "error";
    }
    //return message
    echo json_encode($message);
?>