<?php
include 'config.php';
$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$userID = $obj['username'];

if (isset($obj['username']) != ""){
    echo $userID
    $query = "SELECT username FROM user WHERE userID = " . $userID;
} else {
    echo "error";
}
?>