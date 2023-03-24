<?php
	//file that returns api key for address checking
	include 'config.php';
	
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	
	echo json_encode('AIzaSyCM8-6wAN_bMyyyq7Hp_kecmqwX8MbqFKk');
?>