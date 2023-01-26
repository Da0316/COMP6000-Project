<?php
	//echo json_encode($MESSAGE);
	if(!empty($_FILES['name']['name'])){
		$target_dir = "test";
		if(!file_exists($target_dir)){
			$data = array(
				(object)array(
					'code' => '400',
					'message' => 'Can\'t find folder.'
				)
			);
			$json = json_encode($data);
			echo $json;
			die();
		}
		$target_file = $target_dir . basename($_FILES['name']['name']);
		$image_file_type = pathinfo($target_file,PATHINFO_EXTENSION);
		if(file_exists($target_file)){
			$data = array(
				(object)array(
					'code' => '400',
					'message' => 'Sorry. File already exists.'
				)
			);
			$json = json_encode($data);
			echo $json;
			die();
		}
		if($_FILES['name']['size'] > 50000000){
			$data = array(
				(object)array(
					'code' => '400',
					'message' => 'Sorry. Your file is too large.'
				)
			);
			$json = json_encode($data);
			echo $json;
			die();
		}
		if(move_uploaded_file($_FILES['name']['tmp_name'], $target_file)){
			$data = array(
				(object)array(
					'code' => '200',
					'message' => 'Successfuly your file has been uploaded.',
					'name' => $_FILES['name']
				)
			);
			$json = json_encode($data);
			echo $json;
			die();
		}else{
			$data = array(
				(object)array(
					'code' => '400',
					'message' => 'Sorry. There was something wrong. Try it again.'
				)
			);
			$json = json_encode($data);
			echo $json;
			die();
		}
	}
?>