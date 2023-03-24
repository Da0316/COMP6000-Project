<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

//json variables
$userPostedID = $obj['userID'];

//if json variable is set
if (isset($obj["userID"]) != "") {
    //gets user data
    $query = sprintf(
        "SELECT * FROM user WHERE userID = " . $userPostedID,
        $mysqli->real_escape_string($userPostedID)
    );
    $result = $mysqli->query($query);
    //if user exists
    if ($result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        //returns user data in an array
        echo json_encode(array($row['userID'], $row['username'], $row['firstname'], $row['lastname'], $row['date_of_birth'], $row['address'], $row['email'], $row['phone_number']));
    } else {
        //if user doesnt exist
        echo json_encode("user doesn't exist");
    }
} else {
    //if json variable isnt set
    echo json_encode("error");
}
?>