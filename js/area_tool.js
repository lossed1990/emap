var request = null;

/**
 * @brief 绑定室内地图下拉菜单事件
 */
$('#menu-indoor-area').on('click','li',function(){
    //alert($(this).text());
	requestChangeIndoorMap($(this).text());
});

/**
* @breif 请求切换室内图层
*/
function requestChangeIndoorMap(area) {
    
	if(!request) {
	    request = getXMLHTTPRequest();
		
		if(!request){
		    return;
		}
	}
	
	var thePage = 'mapunit/request_change_area.php';
	myRand = parseInt(Math.random()*999999999999999);  //创建随机数，避免浏览器缓存该请求
	var theUrl = thePage + "?area=" + area + "&rand=" + myRand;
	request.open("GET",theUrl,true);     //true 表示异步
	request.onreadystatechange = onChangeIndoorMap;
	request.send(null);
}

/**
* @breif 切换室内图层回调函数
*/
function onChangeIndoorMap() {
    if(request.readyState == 4) {
	    if(request.status == 200) {
		
			var ok = request.responseXML.getElementsByTagName("ok")[0].childNodes[0].nodeValue;
			var errorinfo = request.responseXML.getElementsByTagName("errorinfo")[0].childNodes[0].nodeValue;
			var htmlinfo;
			if(ok == 0) { //success
                var filePath = request.responseXML.getElementsByTagName("filepath")[0];
				//alert(filePath.childNodes[0].nodeValue);
				
				var fileWidth = request.responseXML.getElementsByTagName("width")[0];
				//alert(fileWidth.childNodes[0].nodeValue);
				
				var fileHeight = request.responseXML.getElementsByTagName("height")[0];
				//alert(fileHeight.childNodes[0].nodeValue);
				
				var layoutID = request.responseXML.getElementsByTagName("layoutid")[0];
				//alert(layoutID.childNodes[0].nodeValue);
				//var info = "file:" + filePath.childNodes[0].nodeValue + " width:" + fileWidth.childNodes[0].nodeValue + " height:" + fileHeight.childNodes[0].nodeValue;
				//alert(info);

				if(filePath && fileWidth && fileHeight) {	
			        setMap(filePath.childNodes[0].nodeValue,fileWidth.childNodes[0].nodeValue,fileHeight.childNodes[0].nodeValue);
					
					//保存当前图层ID
					setCurrentLayoutId(layoutID.childNodes[0].nodeValue);
					
					//标注节点图标
					removeAllMarkerOnIndoorMap();
					
					var markerList = request.responseXML.getElementsByTagName("markerlist")[0];
					if(markerList) {
						var markerCount = markerList.getElementsByTagName("count")[0].childNodes[0].nodeValue;
						for(var i=0; i < markerCount; ++i)
						{
							var markerName = markerList.getElementsByTagName("name")[i].childNodes[0].nodeValue;
							var markerPosition = markerList.getElementsByTagName("position")[i].childNodes[0].nodeValue;
							var markerType = markerList.getElementsByTagName("type")[i].childNodes[0].nodeValue;
							
							var mResult = markerPosition.split(',');
							var point = [mResult[0],mResult[1]];
							if(markerName && markerPosition && markerType) {
							    addMarkerOnIndoorMap(markerName,markerType,point);
							}
						}
					}
			    }
            } else {
			    htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-warning'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-worning-close'>&times;</button><strong>警告！</strong>" + errorinfo + "</div>";	             
                $('#div-worning').html(htmlinfo);
			}	
		}
	}else {
	    //alert("请求失败");
	}
}

/**
* @breif 请求新增室内图层
*/
function requestAddIndoorMap() {

	var options = {  
	   //target: '#output',          //把服务器返回的内容放入id为output的元素中      
	   //beforeSubmit: showRequest,  //提交前的回调函数  
	   success: showResponse,      //提交后的回调函数  
	   //url: url,                 //默认是form的action， 如果申明，则会覆盖  
	  // type: post,                 //默认是form的method（get or post），如果申明，则会覆盖  
	   //dataType: null,           //html(默认), xml, script, json...接受服务端返回的类型  
	   //clearForm: true,          //成功提交后，清除所有表单元素的值  
	   //resetForm: true,          //成功提交后，重置所有表单元素的值  
	   timeout: 3000               //限制请求的时间，当请求大于3秒后，跳出请求  
	}  
	  
	//function showRequest(formData, jqForm, options){  
	//   //formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]  
	//   //jqForm:   jQuery对象，封装了表单的元素     
	//   //options:  options对象  
	//   var queryString = $.param(formData);   //name=1&address=2  
	//   var formElement = jqForm[0];              //将jqForm转换为DOM对象  
	//   var address = formElement.address.value;  //访问jqForm的DOM元素  
	//   return true;  //只要不返回false，表单都会提交,在这里可以对表单元素进行验证  
	//};  
	  
	function showResponse(responseText, statusText){  
	    //alert(responseText);
		//alert(statusText);
	   //dataType=xml  
	   var errorinfo = responseText.getElementsByTagName("errorinfo")[0].childNodes[0].nodeValue;  
	   var ok = responseText.getElementsByTagName("ok")[0].childNodes[0].nodeValue;  
	   //alert(errorinfo);
	   if(ok == 0) {
	       $('#add-indoorarea-form').clearForm();
	   }
	   //var address = $('address', responseXML).text();  
	   //$("#xmlout").html(name + "  " + address);  
	   ////dataType=json  
	   //$("#jsonout").html(data.name + "  " + data.address); 
	   
	   var htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-warning'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-worning-close'>&times;</button><strong>警告！</strong>" + errorinfo + "</div>";
	   
        $('#div-addindoormap-worning').html(htmlinfo);
        //$('#div-addindoormap-worning').show();	   
	};  
	
	$('#add-indoorarea-form').ajaxForm(options);

    //$('#add-indoorarea-form').ajaxForm(function() {        
    //    alert("提交成功！");		
    //}); 
}

/**
* @breif 请求获取所有室内地图
*/
function requestGetIndoorMap() {	
	$.ajax({
	    type: "post",
		url: "mapunit/request_get_area.php",
		success: function (result) {   
			var ok = result.getElementsByTagName("ok")[0].childNodes[0].nodeValue;
			var errorinfo = result.getElementsByTagName("errorinfo")[0].childNodes[0].nodeValue;
			var htmlinfo;
			if(ok == 0) { //success
			    var count = result.getElementsByTagName("count")[0].childNodes[0].nodeValue;
				var htmlmenu = "";
				for(i=0; i < count; i++)
				{
				    var areaname = result.getElementsByTagName("area")[i].childNodes[0].nodeValue;
				    //htmlmenu = htmlmenu + "<li><a onclick='requestChangeIndoorMap(&#39" + areaname + "&#39)'>" + areaname + "</a></li>";
					htmlmenu = htmlmenu + "<li><a>" + areaname + "</a></li>";
				}

				//var htmlmenu = "<li><a onclick='requestChangeIndoorMap(&#39网点1&#39)'>网点1</a></li>";
			    $('#menu-indoor-area').html(htmlmenu);	

                htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-success'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-success-close'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";	                          	             				
			} else {
			    htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-warning'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-worning-close'>&times;</button><strong>警告！</strong>" + errorinfo + "</div>";	             
            }	
   
			$('#div-worning').html(htmlinfo);			
		}
	});
}










