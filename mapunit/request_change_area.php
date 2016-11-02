<?php
    header('Content-Type: text/xml');

    $areaname = $_GET[ 'area' ]; 
	error_log($areaname);
	
	@ $db = new mysqli('localhost','gxl','abc123','map');
	if (mysqli_connect_errno()) {
		echoErrorResultInfoXML('数据库连接失败！');
		exit;
	}
	
	$sql = "select * from indoor_area where `name`='".$areaname."'";
	$result = $db->query($sql);
	
	$count = $result->num_rows;
	if($count == 0){
	    echoErrorResultInfoXML('未找到相关地图！');	
	} else {
						
		$row = $result->fetch_assoc();
		$filename = htmlspecialchars(stripcslashes($row['mapfile']));
		$layoutid = stripcslashes($row['id']);
			
		$destination_folder="../indoormapfile/";
		$destination = $destination_folder.$filename;
		if (file_exists($destination)) { 
		    $image_size = getimagesize($destination);
			
			$sql = "select * from node where `layout_id`='".$layoutid."'";
	        $markerResult = $db->query($sql);		
			$markerCount = $markerResult->num_rows;
			error_log("markerCount:".$markerCount);
			
			$markerXMLString = "<markerlist><count>".$markerCount."</count>";
			for($i = 0; $i < $markerCount; $i++) {
			    
				$markerRow = $markerResult->fetch_assoc();
				
				$markerName = htmlspecialchars(stripcslashes($markerRow['name']));
				$markerPosition = htmlspecialchars(stripcslashes($markerRow['position']));
				$markerType = htmlspecialchars(stripcslashes($markerRow['type']));
				
				$markerXMLString = $markerXMLString."<marker><name>".$markerName."</name><position>".$markerPosition."</position><type>".$markerType."</type></marker>";
			}
			$markerXMLString = $markerXMLString."</markerlist>";
			error_log("markerXMLString:".$markerXMLString);
			
		    echo "<?xml version=\"1.0\" ?>
				  <map>
					<ok>0</ok> 
					<errorinfo>地图图层切换成功</errorinfo>
					<layoutid>".$layoutid."</layoutid>
					<area>".$areaname."</area>
					<filepath>".$filename."</filepath>
					<width>".$image_size[0]."</width>
				    <height>".$image_size[1]."</height>".$markerXMLString.
				  "</map>";				 				
	    }
		else
		{
		    echoErrorResultInfoXML('地图文件被删除！');
		}
    }
	
	$result->free();
	$db->close();

	/**
     * @brief 填充错误信息
     */	
	function echoErrorResultInfoXML($errorinfo) {
	    echo "<?xml version=\"1.0\" ?>
			  <map>
			    <ok>1</ok> 
				<errorinfo>".$errorinfo."</errorinfo>			
			  </map>"; 
	}
?>

