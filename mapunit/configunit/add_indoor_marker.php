<?php
	header('Content-Type: text/xml');
	
error_log("add_indoor_marker.php");
	
	//检测请求类型
	if ($_SERVER['REQUEST_METHOD'] != 'POST'){
		echoResultInfoXML(1,'请求类型错误!');
		exit;
	}
	
	if (!isset($_POST) || empty($_POST["markername"])) {
	    echoResultInfoXML(1,'请输入节点名称!');
		exit;
	}
	
	if (empty($_POST["markerlayoutid"])) {
	    echoResultInfoXML(1,'图层异常，请重试!');
		exit;
	}
	
	if (empty($_POST["markertype"])) {
	    echoResultInfoXML(1,'请选择节点类型!');
		exit;
	}
	
	if (empty($_POST["markerposition"])) {
	    echoResultInfoXML(1,'请选择节点坐标!');
		exit;
	}
	
	//检查参数
	$markername = trim($_POST['markername']);
    $markerlayoutid = trim($_POST['markerlayoutid']);
	$markertype = trim($_POST['markertype']);
	$markerposition = trim($_POST['markerposition']);
	
	error_log("markername:".$markername);
	error_log("markerlayoutid:".$markerlayoutid);
	error_log("markertype:".$markertype);
	error_log("markerposition:".$markerposition);
	
	if (!$markername) {
		echoResultInfoXML(1,'请输入节点名称!');
		exit;
	}
	
	if (!get_magic_quotes_gpc()) {
	    $markerlayoutid = addslashes($markerlayoutid);
		$markername = addslashes($markername);
		$markertype = addslashes($markertype);
		$markerposition = addslashes($markerposition);		
	}
	
	//检测数据库连接
	@ $db = new mysqli('localhost','gxl','abc123','map');
	
	if (mysqli_connect_errno()) {
		echoResultInfoXML(1,'数据库连接失败！');
		exit;
	}
	
	$sql = "insert into `node` values (NULL,'".$markername."' ,'".$markerlayoutid."' , '".$markerposition."' , '".$markertype."') ";
	$result = $db->query($sql);
	
	if($result) {
	    $tip = "新节点添加成功，位置：".$markerposition;
		//echoResultInfoXML(0,$tip);  
		
		echo "<?xml version=\"1.0\" ?>
			  <result>
				<ok>0</ok> 
				<errorinfo>".$tip."</errorinfo>
				<name>".$markername."</name>
				<type>".$markertype."</type>
				<position>".$markerposition."</position>		
			  </result>";
	}else {
		echoResultInfoXML(1,'添加失败');  	
	}
	
	$db->close();

	/**
	 * @brief 返回的结果信息XML
	 * ok 0-成功 其他失败  errorinfo 错误描述
	 */	 
	function echoResultInfoXML($ok,$errorinfo){
	    
		echo "<?xml version=\"1.0\" ?>
			  <result>
				<ok>".$ok."</ok> 
				<errorinfo>".$errorinfo."</errorinfo>
			  </result>"; 

error_log($errorinfo);			  
	}	
?>
