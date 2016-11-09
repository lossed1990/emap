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


//=====初始化相关=====
/**
 * @breif 初始化相关地图
 */
function initMaps() {
    g_oOutDoorMap.initMap();
    initIndoorMap();
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







//=====图层信息显示区相关界面事件处理=====
/**信息区移动事件*/
$("#map-info").draggable({ containment: "body", scroll: false, cursor: "move" });

/**关闭按钮点击事件*/
$("#map-info-close").click(function() {
    $("#map-info").css("visibility", "hidden");
    $("#map-info-base").css("visibility", "hidden");
    $("#map-info-node").css("visibility", "hidden");
});

/**tab切换按钮点击事件*/
$("#map-info-indicators-base").click(function() {
    //更换icon
    $("#map-info-indicators-base").removeClass("icon-circle-blank");
    $("#map-info-indicators-base").addClass("icon-circle");
    $("#map-info-indicators-node").removeClass("icon-circle");
    $("#map-info-indicators-node").addClass("icon-circle-blank");
    //隐藏panel
    $("#map-info-base").css("visibility", "visible");
    $("#map-info-node").css("visibility", "hidden");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;图层信息");
});
$("#map-info-indicators-node").click(function() {
    //更换icon
    $("#map-info-indicators-node").removeClass("icon-circle-blank");
    $("#map-info-indicators-node").addClass("icon-circle");
    $("#map-info-indicators-base").removeClass("icon-circle");
    $("#map-info-indicators-base").addClass("icon-circle-blank");
    //隐藏panel
    $("#map-info-base").css("visibility", "hidden");
    $("#map-info-node").css("visibility", "visible");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;节点列表");
});


//=====检索区相关界面事件处理=====
/**检索区移动事件*/
$("#map-search").draggable({ containment: "body", scroll: false, cursor: "move" });
/**检索输入框点击事件*/
$("#map-search-input").click(function() {
    $("#map-search").css("height", "400px");
    $("#map-search-panel").css("visibility", "visible");
});
/**检索按钮点击事件*/
$("#map-search-btn").click(function() {
    $("#map-search").css("height", "400px");
    $("#map-search-panel").css("visibility", "visible");
});
/**判断是否需要隐藏检索区域*/
(function() {
    var bIn = false;
    $("#map-search").mouseleave(function() { bIn = false; });
    $("#map-search").mouseenter(function() { bIn = true; });
    $("body").mousedown(function() {
        if (!bIn) {
            $("#map-search").css("height", "45px");
            $("#map-search-panel").css("visibility", "hidden");
        }
    });
}());


//=====工具栏区相关界面事件处理=====
/**初始化工具栏菜单*/
(function() {
    var items = document.querySelectorAll('.map-tools-menuItem');
    for (var i = 0, l = items.length; i < l; i++) {
        items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
        items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
    }

    /**工具栏菜单按钮点击事件*/
    document.querySelector('.map-tools-center').onclick = function(e) {
        e.preventDefault();
        document.querySelector('.map-tools').classList.toggle('map-tools-open');
    }

    /**工具栏移动*/
    $(".map-tools").draggable({ containment: "body", scroll: false, cursor: "move" });
}());

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