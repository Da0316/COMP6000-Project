<?php
    //include config
    include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

    //json variables
    $jobID = $obj['jobID'];
    $applyingUserID = $obj['applyingID'];

    //getting the userID of the host user
    $query = "SELECT userID FROM jobs WHERE jobID = '" . $jobID . "'";
    $result = $mysqli->query($query);
    $row = mysqli_fetch_assoc($result);
    $hostUserID = $row['userID'];

    //set outstanding to false
    $outstanding = false;

    //check if host user has an outstanding job with the applying user
    $query2 = "SELECT jobID FROM jobs WHERE userID = '" . $hostUserID . "' AND job_accepted = '1' AND job_completed = '0' AND jobID != '" . $jobID . "'";
    $result2 = $mysqli->query($query2);
    if (mysqli_num_rows($result2) > 0){
        while ($row2 = mysqli_fetch_assoc($result2)){
            $query3 = "SELECT userID FROM applications WHERE jobID = '" . $row2['jobID'] . "' AND status = '1'";
            $result3 = $mysqli->query($query3);
            if (mysqli_num_rows($result3) > 0){
                $row3 = mysqli_fetch_assoc($result3);
                if ($row3['userID'] == $applyingUserID){
                    //set to true if one is found
                    $outstanding = true;
                }
            }
        };
    };

    //check if applying user has an outstanding job with the host user
    $query4 = "SELECT jobID FROM jobs WHERE userID = '" . $applyingUserID . "' AND job_accepted = '1' AND job_completed = '0'";
    $result4 = $mysqli->query($query4);
    if (mysqli_num_rows($result4) > 0){
        while ($row4 = mysqli_fetch_assoc($result4)){
            $query5 = "SELECT userID FROM applications WHERE jobID = '" . $row4['jobID'] . "' AND status = '1'";
            $result5 = $mysqli->query($query5);
            if (mysqli_num_rows($result5) > 0){
                $row5 = mysqli_fetch_assoc($result5);
                if ($row5['userID'] == $hostUserID){
                    //set to true if one is found
                    $outstanding = true;
                }
            }
        }
    }

    //return outstanding boolean
    echo json_encode($outstanding);
?>