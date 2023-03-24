<?php

//connection
$mysqli = mysqli_connect("dragon.kent.ac.uk", "comp6000_08", "0inbell", "comp6000_08");


// Check connection
if (mysqli_connect_errno()) {
  
  //error message
  echo json_encode(array('err' => true, 'msg' => mysqli_connect_error()));
}
?>