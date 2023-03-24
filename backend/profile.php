<?php
//include config
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
//json variable
$userID = $obj['userID'];
//if the userID is set
if (isset($obj["userID"]) != "") {
    //gets user details for that userID
    $query = sprintf(
        "SELECT * FROM user WHERE userID = " . $userID,
        $mysqli->real_escape_string($userID)
    );
    $result = $mysqli->query($query);
    //if user exists
    if ($result->num_rows > 0) {
        //return array of user data
        $row = mysqli_fetch_assoc($result);
        echo json_encode(array($row['userID'], $row['username'], $row['firstname'], $row['lastname'], $row['date_of_birth'], $row['address'], $row['email'], $row['phone_number'], $row['imageName']));
    } else {
        //return if user doesnt exist
        echo json_encode("user doesn't exist");
    }
} else {
    //if userID isnt set 
    echo "error";
}
?>