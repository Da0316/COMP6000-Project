<?php
    // include config.php
    include 'config.php';
    $json = file_get_contents('php://input');
    $obj = json_decode($json, true);
    // json variables 
    $userID = $obj['userID'];

    // gets all ratings for that user
    $query = "SELECT rating FROM reviews WHERE userPostedID = '" . $userID . "'";
    $result = $mysqli->query($query);

    $rating = 0;
    $count = 0;

    if ($result->num_rows > 0){
        // loop through results
        while ($row = mysqli_fetch_assoc($result)){
            $rating = $rating + $row['rating'];
            $count++;
        }
        // calculate average rating 
        $rating = $rating / $count;
    }
    // return rating
    echo json_encode(round($rating, 1));
?>