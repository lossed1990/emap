//=====Ajax相关=====
/**
 * @breif 创建XMLHTTPRequest对象
 */
function getXMLHTTPRequest() {
    var req = false;

    try {
        //for Firefox
        req = new XMLHttpRequest();
    } catch (err) {
        try {
            //for some versions of IE
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (err) {
            try {
                //for some other versions of IE
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (err) {
                req = false;
            }
        }
    }

    return req;
}
/*} */


//=====工具栏相关=====
/**
 * @breif 初始化相关地图
 */
function initialize() {
    //initGoogleMap();
    //initOutdoorMap();
    g_oOutDoorMap.initMap();
    initIndoorMap();
}

/**
 * @breif 交换地图位置
 *
 * 通过修改所属css类完成
 */
function exchangeMapPosition() {
    var classname = document.getElementById('map_indoor').className;

    document.getElementById('map_indoor').className = document.getElementById('map_outdoor').className;
    document.getElementById('map_outdoor').className = classname;

    //交换显示值，以防交换时小地图被隐藏
    var visible = document.getElementById('map_indoor').style.visibility;
    document.getElementById('map_indoor').style.visibility = document.getElementById('map_outdoor').style.visibility;
    document.getElementById('map_outdoor').style.visibility = visible;

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
function hideOrShowSmallMap() {
    var smallMapDiv;
    if (document.getElementById('map_outdoor').className === "map_small") {
        smallMapDiv = document.getElementById('map_outdoor');
    } else {
        smallMapDiv = document.getElementById('map_indoor');
    }

    if (smallMapDiv.style.visibility === "hidden") {
        smallMapDiv.style.visibility = "visible"; //显示	
    } else {
        smallMapDiv.style.visibility = "hidden"; //隐藏
    }
}

/**
 * @breif 改变鼠标样式,用以显示标记状态
 */
function exchangeMouseCursor() {
    var wndObj = document.getElementsByTagName("body");
    var currentState = wndObj[0].style.cursor;
    if (currentState !== 'crosshair') {
        wndObj[0].style.cursor = 'crosshair';
    } else {
        wndObj[0].style.cursor = 'auto';
    }
}