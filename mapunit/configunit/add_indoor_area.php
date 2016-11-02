<?php
	header('Content-Type: text/xml');
	 
	//检测请求类型
	if ($_SERVER['REQUEST_METHOD'] != 'POST'){
		echoResultInfoXML(1,'请求类型错误!');
		exit;
	}
	
	//检查参数
	$areaname = trim($_POST['areaname']);
	$areatype = trim($_POST['areatype']);
	$fatherarea = trim($_POST['fatherarea']);
	$linkman = trim($_POST['linkman']);
	$areanum = trim($_POST['areanum']);
	$phonenum = trim($_POST['phonenum']);
	
	if (!$areaname) {
		echoResultInfoXML(1,'请输入图层名称!');
		exit;
	}
	
	if (!get_magic_quotes_gpc()) {
		$areaname = addslashes($areaname);
		$areatype = addslashes($areatype);
		$fatherarea = addslashes($fatherarea);
		$linkman = addslashes($linkman);
		$areanum = addslashes($areanum);
		$phonenum = addslashes($phonenum);
	}
	
	//上传文件 
	$uptypes=array('image/jpg', 'image/jpeg', 'image/png', 'image/pjpeg', 'image/bmp', 'image/x-png'); //上传文件类型列表
	$max_file_size=5242880;                          //上传文件大小限制, 单位BYTE
	$destination_folder="../../indoormapfile/";      //上传文件路径				
	$imgpreview=1;                                   //是否生成预览图(1为生成,其他为不生成);
	$imgpreviewsize=1/2;                             //缩略图比例
	
	if(empty($_FILES['upfile']['tmp_name'])) {
	    echoResultInfoXML(1,'地图文件为空，请选择!');
		exit;
	}

	$file = $_FILES["upfile"];
	if($max_file_size < $file["size"]) { //检查文件大小
		echoResultInfoXML(1,'地图文件太大，请限制在5M范围内!');
		exit;
	}

	if(!in_array($file["type"], $uptypes)) { //检查文件类型
		echoResultInfoXML(1,'地图文件类型不符，请重新选择!');
		exit;
	}

	if(!file_exists($destination_folder)) {
		mkdir($destination_folder);
	}

	$filename=$file["tmp_name"];
			
	//$image_size = getimagesize($filename);
	$pinfo=pathinfo($file["name"]);
	$ftype=$pinfo['extension'];
	$destination = $destination_folder.time().".".$ftype;
	if (file_exists($destination)) {  //以防多客户端提交冲突
		echoResultInfoXML(1,'服务器繁忙，请稍候重试!');  
		exit;
	}

	if(!move_uploaded_file ($filename, $destination)) {  //移动文件出错
		echoResultInfoXML(1,'服务器存储文件失败，请检查服务器磁盘容量!');  
		exit;
	}

	$pinfo=pathinfo($destination);
	$fname=$pinfo['basename'];
	//echo " <font color=red>已经成功上传</font><br>文件名:  <font color=blue>".$destination_folder.$fname."</font><br>";
	//echo " 宽度:".$image_size[0];
	//echo " 长度:".$image_size[1];
	//echo "<br> 大小:".$file["size"]." bytes";
	//echo $fname;

	//if($imgpreview==1)
	//{
	//    echo "<br>图片预览:<br>";
	//    echo "<img src=\"".$destination."\" width=".($image_size[0]*$imgpreviewsize)." height=".($image_size[1]*$imgpreviewsize);
	//    echo " alt=\"图片预览:\r文件名:".$destination."\r上传时间:\">";
	//}
		
	
	//检测数据库连接
	@ $db = new mysqli('localhost','gxl','abc123','map');
	
	if (mysqli_connect_errno()) {
		echoResultInfoXML(1,'数据库连接失败！');
		exit;
	}
	
	$sql = "insert into  indoor_area values (NULL,'".$areaname."' , '".$areatype."' , '".$fatherarea."' , '".$linkman."' , '".$areanum."' , '".$phonenum."' , '".$fname."' ) ";
	$result = $db->query($sql);
	
	if($result) {
	    $tip = "新图层".$areaname."添加成功";
		echoResultInfoXML(0,$tip);  
	}else {
		echoResultInfoXML(1,'添加失败');  	
	}
	
	$db->close();

	//echo '数据库连接成功！<br/>';
	//echo 'gxl<br/>';
	//echo  $areaname.'<br/>';
	//echo  $areatype;

	
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
	}	
?>
