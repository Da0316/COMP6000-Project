<?php

include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

// if (isset($obj["userID"]) != "") {
$query = "SELECT * FROM specialities";
$array = array();

// // look through query
// while($row = mysql_fetch_assoc($query)){
//     // add each row returned into an array
//   $array[] = $row

//$result = $mysqli->query($query);
//     if ($result->num_rows > 0) {
//         $row = mysqli_fetch_assoc($result);
//         echo json_encode(array($row['userID'], $row['firstname'], $row['lastname'], $row['date_of_birth'], $row['address'], $row['email'], $row['phone_number']));
//     } else {
//         echo "user doesn't exist";
//     }
// } else {
//     echo "error";
// }

?>