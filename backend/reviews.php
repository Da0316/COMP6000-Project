<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');

//post variables
$jobid = $_POST['jobid'];
$type = $_POST['type'];

//if the type is post
if ($type == "post") {
    //gets a teh reviews
    $query = sprintf(
        "SELECT `reviews`.`reviewID`, `reviews`.`userID`, `reviews`.`rating`, `reviews`.`review_text`, `reviews`.`timestamp`, `reviews`.`jobid`,`user`.`userID`,`user`.`username`,`user`.`email`,`user`.`imageName` FROM `reviews` JOIN  `user` ON `user`.`userID`=`reviews`.`userID` WHERE `reviews`.`jobid`='$jobid'",
        $mysqli->real_escape_string($jobid)
    );

    $returnArray = array();
    $result = $mysqli->query($query);
    //loops through the results
    while ($row = mysqli_fetch_assoc($result)) {

        //populates array
        $returnArray[] = array(
            'userID' => $row["userID"],
            'username' => $row["username"],
            'email' => $row["email"],
            'image' => $row["imageName"],
            'review_text' => $row["review_text"],
            'timestamp' => $row["timestamp"],
            'rating' => $row["rating"],

        );


    }
    //returns array
    echo json_encode($returnArray);
} else {

    //gets all review data
    $query = sprintf(
        "SELECT `reviews`.`reviewID`, `reviews`.`userID`, `reviews`.`rating`, `reviews`.`review_text`, `reviews`.`timestamp`, `reviews`.`jobid`,`user`.`userID`,`user`.`username`,`user`.`email`,`user`.`imageName` FROM `reviews` JOIN  `user` ON `user`.`userID`= `reviews`.`userID` WHERE `reviews`.`userPostedID`='$jobid'",
        $mysqli->real_escape_string($jobid)
    );
    $result = $mysqli->query($query);
    $returnArray = array();
    //loops through review dat 
    while ($row = mysqli_fetch_assoc($result)) {
        //populate return array
        $returnArray[] = array(
            'userID' => $row["userID"],
            'username' => $row["username"],
            'email' => $row["email"],
            'image' => $row["imageName"],
            'review_text' => $row["review_text"],
            'timestamp' => $row["timestamp"],
            'rating' => $row["rating"],
        );

    }

    //retrun array
    echo json_encode($returnArray);
}


?>