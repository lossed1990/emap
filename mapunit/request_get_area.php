<?php
    header('Content-Type: text/xml');
	
	@ $db = new mysqli('localhost','gxl','abc123','map');
	if (mysqli_connect_errno()) {
		echoErrorResultInfoXML('数据库连接失败！');
		exit;
	}
	
	$sql = "select * from indoor_area where 1";
	$result = $db->query($sql);
	
	$count = $result->num_rows;
	if($count == 0){
	    echoErrorResultInfoXML('尚未添加任何室内地图图层！');	
	} else {
		echo "<?xml version=\"1.0\" ?>
				  <map>
					<ok>0</ok> 
					<errorinfo>地图刷新成功</errorinfo>
					<count>".$count."</count>";
					
		for($i=0; $i < $count; $i++) {
			$row = $result->fetch_assoc();
			$areaname = htmlspecialchars(stripcslashes($row['name']));
			
			echo "<area>".$areaname."</area>";
		}
		
		echo "</map>";
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

