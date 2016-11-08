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
    var classname = document.getElementById('map-indoor').className;

    document.getElementById('map-indoor').className = document.getElementById('map-outdoor').className;
    document.getElementById('map-outdoor').className = classname;

    //交换显示值，以防交换时小地图被隐藏
    var visible = document.getElementById('map-indoor').style.visibility;
    document.getElementById('map-indoor').style.visibility = document.getElementById('map-outdoor').style.visibility;
    document.getElementById('map-outdoor').style.visibility = visible;

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
    if ($(".map-small").css("visibility") == "hidden") {
        $(".map-small").css("visibility", "visible");
        //更换icon
        $(".map-tools-ring .icon-eye-open").attr("title", "隐藏小地图");
        $(".map-tools-ring .icon-eye-open").addClass("icon-eye-close");
        $(".map-tools-ring .icon-eye-open").removeClass("icon-eye-open");
    } else {
        $(".map-small").css("visibility", "hidden");
        //更换icon
        $(".map-tools-ring .icon-eye-close").attr("title", "显示小地图");
        $(".map-tools-ring .icon-eye-close").addClass("icon-eye-open");
        $(".map-tools-ring .icon-eye-close").removeClass("icon-eye-close");
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

/**
 * @breif 显示图层信息界面
 */
function showMapInfo() {
    $("#map-info").css("visibility", "visible");

    if ($(".map-info-indicators .icon-circle").attr("id") == "map-info-indicators-node") {
        $("#map-info-node").css("visibility", "visible");
    } else {
        $("#map-info-base").css("visibility", "visible");
    }
}