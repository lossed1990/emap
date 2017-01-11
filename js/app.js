//=====初始化相关=====
/**
 * @breif 初始化相关地图
 */
function initMaps() {
    //初始化提示框toastr的相关参数
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

    g_oAddLayerDialog.init();
    g_oAddNodeDialog.init();

    g_oOutDoorMap.init();
    g_oInDoorMap.init();

    g_oMapToolWnd.init();
    g_oSearchWindow.init();
    g_oLayoutManagerWindow.init();

    //绑定图层数据改变监听者
    //g_oServerApi.addLayerDataChangeListener(g_oSearchWindow);
    //g_oServerApi.addLayerDataChangeListener(g_oLayoutManagerWindow);
    //g_oServerApi.addLayerDataChangeListener(g_oAddLayerDialog);

    g_oServerApi.addAreaDataChangeListener(g_oSearchWindow);
    g_oServerApi.addAreaDataChangeListener(g_oAddLayerDialog);
    g_oServerApi.addAreaDataChangeListener(g_oOutDoorMap);
    g_oServerApi.addAreaDataChangeListener(g_oLayoutManagerWindow);

    g_oServerApi.ajaxRefreshAllAreaNode();
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