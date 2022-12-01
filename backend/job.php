<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$jobID = $obj['jobID'];

if (isset($obj["userID"]) != ""){
    $query = "SELECT * FROM jobs WHERE jobID = " . $jobID;
    $result = $mysqli->query($query);
    if ($result->num_rows > 0){
        $row = mysqli_fetch_assoc($result);
        echo $row["userID"];
        echo $row["specialityID"];
    } else {
        echo "job doesn't exist";
    }
} else {
    echo "error";
}


?>