/**
 * @brief 绑定节点类型选择下拉菜单事件
 */
$('#menu-note-type').on('click','li',function(){
    //alert($(this).text());
	$("#markertype").val($(this).text());
});

/**
 * @breif 请求添加地图节点至数据库
 */
function requestAddIndoorMarker() {

	var options = {  
	   success: showResponse1,      //提交后的回调函数     
	   timeout: 3000                //限制请求的时间，当请求大于3秒后，跳出请求  
	}  
	
	$('#add-note-form').ajaxForm(options); 
  
	function showResponse1(responseText, statusText){  	   
	    var ok = responseText.getElementsByTagName("ok")[0].childNodes[0].nodeValue;
		var errorinfo = responseText.getElementsByTagName("errorinfo")[0].childNodes[0].nodeValue;
		var htmlinfo;
		if(ok == 0) { //success
		    
			var name = responseText.getElementsByTagName("name")[0].childNodes[0].nodeValue;
		    var type = responseText.getElementsByTagName("type")[0].childNodes[0].nodeValue;
			var position = responseText.getElementsByTagName("position")[0].childNodes[0].nodeValue;
			
			alert(name);
			if(name && type && position) {
			    var mResult = position.split(',');
				var point = [mResult[0],mResult[1]];
			    addMarkerOnIndoorMap(name,type,point);
			}
			
			htmlinfo = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";	                          	             				
		    $('#div-worning').html(htmlinfo);
			
			$("#markerlayoutid").val("");
			$("#markername").val("");
			$("#markertype").val("");
            $("#markerposition").val("");
            $('#add-note-modal').modal('hide');
		} else {
			htmlinfo = "<div class='alert alert-warning'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>警告！</strong>" + errorinfo + "</div>";	             
		    $('#div-addnote-worning').html(htmlinfo);
		}		   
	}; 	
}

/**
 * @breif 请求显示添加节点界面
 */
function showAddNoteModal(id,position) {
    $("#markerlayoutid").val(id);
    $("#markerposition").val(position);
    $('#add-note-modal').modal('show');
}







