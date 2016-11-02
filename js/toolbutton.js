/**
* @breif 初始化相关地图
*/
function initialize(){
	initGoogleMap();
	initIndoorMap(); 
}

/**
* @breif 交换地图位置
*
* 通过修改所属css类完成
*/
function exchangeMapPosition(){
	var classname = document.getElementById('map_indoor').className;

    document.getElementById('map_indoor').className = document.getElementById('map_google').className; 
	document.getElementById('map_google').className = classname;

    //交换显示值，以防交换时小地图被隐藏
	var visible = document.getElementById('map_indoor').style.visibility;
    document.getElementById('map_indoor').style.visibility = document.getElementById('map_google').style.visibility;
    document.getElementById('map_google').style.visibility = visible;

    //此处注意触发一个窗口大小改变事件，用于地图引擎的重新加载，否则地图将会出现异常
	var resizeEvent = document.createEvent("HTMLEvents");
    resizeEvent.initEvent("resize", false, true);
    window.dispatchEvent(resizeEvent);
}

/**
* @breif 隐藏|显示小地图
*
* 通过修改所属css类完成
*/
function hideOrShowSmallMap(){
    var smallMapDiv;
    if(document.getElementById('map_google').className === "map_small"){
        smallMapDiv = document.getElementById('map_google');	
    }else{
        smallMapDiv = document.getElementById('map_indoor');
    }

    if(smallMapDiv.style.visibility === "hidden"){
        smallMapDiv.style.visibility = "visible";  //显示	
    }else{
    	smallMapDiv.style.visibility = "hidden";   //隐藏
    }
}