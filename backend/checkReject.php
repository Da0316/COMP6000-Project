<?php
    //include database config
    include 'config.php';
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);

    //json variables
    $jobID = $obj['jobID'];
    $userLoggedInID = $obj['userIDLoggedIn'];
    $otherUsername = $obj['userNameOtherUser'];

    //return message
    $message = 1;

    //gets the userID for job posted
    $query = "SELECT userID FROM jobs WHERE jobID = '" . $jobID . "'";
    $result = $mysqli->query($query);
    $row = mysqli_fetch_assoc($result);
    //if the user Logged in is the host user
    if ($row['userID'] == $userLoggedInID){
        //gets the userID of the other user
        $query2 = "SELECT userID FROM user WHERE username = '" . $otherUsername . "'";
        $result2 = $mysqli->query($query2);
        $row2 = mysqli_fetch_assoc($result2);
        //gets applications for that job where the userID is the other user and application has been rejected
        $query3 = "SELECT * FROM applications WHERE jobID = '" . $jobID . "' AND userID = '" . $row2['userID'] . "' AND status = '-1'";
        $result3 = $mysqli->query($query3);
        //if they have been rejected
        if ($result3->num_rows > 0){
            $message = -1;
        }
    //if not host user
    } else {
        //gets applications for that job where the userID is the user logged in and application has been rejected
        $query4 = "SELECT * FROM applications WHERE jobID = '" . $jobID . "' AND userID = '" . $userLoggedInID . "' AND status = '-1'";
        $result4 = $mysqli->query($query4);
        //if they have been rejected
        if ($result4->num_rows > 0){
            $message = -1;
        }
    }
    //return
    echo json_encode($message);
?>