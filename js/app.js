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
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    g_oAddLayerDialog.initDialog();
    g_oAddNodeDialog.initDialog();

    g_oOutDoorMap.initMap();
    g_oInDoorMap.initMap();
    //initIndoorMap();

    g_oMapToolWnd.initTool();

    // g_oInDoorMap.setMap("img/map_picture/map.jpg", 1920, 1200);
    g_oInDoorMap.setMap("http://192.168.2.26:9001/file/getImage.do?fid=IMG20161220172404340&type=0", 1920, 1200);

    g_oSearchWindow.initWnd();
    g_oLayoutManagerWindow.init();

    g_oServerApi.addLayerDataChangeListener(g_oSearchWindow);
    g_oServerApi.addLayerDataChangeListener(g_oLayoutManagerWindow);
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
    $("#map-info-indicators-base").removeClass("fa-circle-o");
    $("#map-info-indicators-base").addClass("fa-circle");
    $("#map-info-indicators-node").removeClass("fa-circle");
    $("#map-info-indicators-node").addClass("fa-circle-o");
    //隐藏panel
    $("#map-info-base").css("visibility", "visible");
    $("#map-info-node").css("visibility", "hidden");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;图层信息");
});
$("#map-info-indicators-node").click(function() {
    //更换icon
    $("#map-info-indicators-node").removeClass("fa-circle-o");
    $("#map-info-indicators-node").addClass("fa-circle");
    $("#map-info-indicators-base").removeClass("fa-circle");
    $("#map-info-indicators-base").addClass("fa-circle-o");
    //隐藏panel
    $("#map-info-base").css("visibility", "hidden");
    $("#map-info-node").css("visibility", "visible");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;节点列表");
});