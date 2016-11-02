/**
* @breif 显示图层添加控件
*/
//function showAddLayoutDiv(){
//    var wndObj=document.getElementById("add-layout");
//	wndObj.style.visibility = 'visible';
//}

/**
* @breif 隐藏图层添加控件
*/
//function hideAddLayoutDiv(){
//    var wndObj=document.getElementById("add-layout");
//	wndObj.style.visibility = 'hidden';
//}
/**
* @breif 改变鼠标样式,用以显示标记状态
*/
function exchangeMouseCursor(){
    var wndObj=document.getElementsByTagName("body");
	var currentState = wndObj[0].style.cursor;
	if(currentState !== 'crosshair'){
	    wndObj[0].style.cursor = 'crosshair';
	}else{
	    wndObj[0].style.cursor = 'auto';
	}
}