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
    g_oInDoorMap.initMap();
    //initIndoorMap();

    g_oMapTool.initTool();

    g_oInDoorMap.setMap("img/map_picture/map.jpg", 1920, 1200);
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
/**
 * @brief 地图工具对象
 */
var MapTool = {
    createNew: function() {
        var tool = {};

        tool.initTool = function() {
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
        }

        tool.changeSmallMapVisibility = function() {
            if ($(".map-small").css("visibility") == "hidden") {
                $(".map-small").css("visibility", "visible");
                //更换icon
                $(".map-tools-ring .fa-eye").attr("title", "隐藏小地图");
                $(".map-tools-ring .fa-eye").addClass("fa-eye-slash");
                $(".map-tools-ring .fa-eye").removeClass("fa-eye");
            } else {
                $(".map-small").css("visibility", "hidden");
                //更换icon
                $(".map-tools-ring .fa-eye-slash").attr("title", "显示小地图");
                $(".map-tools-ring .fa-eye-slash").addClass("fa-eye");
                $(".map-tools-ring .fa-eye-slash").removeClass("fa-eye-slash");
            }
        }

        tool.showMapInfo = function() {
            $("#map-info").css("visibility", "visible");

            if ($(".map-info-indicators .icon-circle").attr("id") == "map-info-indicators-node") {
                $("#map-info-node").css("visibility", "visible");
            } else {
                $("#map-info-base").css("visibility", "visible");
            }
        }

        tool.exchangeMapPosition = function() {
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

        tool.changeMapState = function() {
            if ($(".map-tools-ring .fa-map-marker").length != 0) {
                //更换icon
                $(".map-tools-ring .fa-map-marker").attr("title", "返回显示地图状态");
                $(".map-tools-ring .fa-map-marker").addClass("fa-globe");
                $(".map-tools-ring .fa-map-marker").removeClass("fa-map-marker");

                g_oOutDoorMap.enterAddMarkerState();
                g_oInDoorMap.enterAddMarkerState();
            } else {
                //更换icon
                tool.restoreMarkerToolIcon();
            }
        }

        tool.restoreMarkerToolIcon = function() {
            $(".map-tools-ring .fa-globe").attr("title", "进入标注节点状态");
            $(".map-tools-ring .fa-globe").addClass("fa-map-marker");
            $(".map-tools-ring .fa-globe").removeClass("fa-globe");

            g_oOutDoorMap.leaveAddMarkerState();
            g_oInDoorMap.leaveAddMarkerState();
        }

        return tool;
    }
};

//地图工具全局对象
var g_oMapTool = MapTool.createNew();


//=====新增节点界面事件处理=====
/**
 * @brief 绑定节点类型选择下拉菜单事件
 */
$('#map-dialog-node-menutype').on('click', 'li', function() {
    $("#map-dialog-node-type").val($(this).text());
    $("#map-dialog-node-type").attr("icon", $(this).attr("icon"));
});

$("#map-dialog-node-submit").click(function() {
    if ($("#map-dialog-node-name").val() == "") {
        var htmlinfo = fillErrorHtml("请输入节点名称");
        $('#map-dialog-node-worning').html(htmlinfo);
        return;
    }

    //获取参数，构造节点json对象
    var markerObject = {
        "type": "Feature",
        "properties": {
            "title": $("#map-dialog-node-name").val(),
            "icon": $("#map-dialog-node-type").attr("icon"),
            "description": $("#map-dialog-node-description").val()
        },
        "geometry": {
            "type": "Point",
            "coordinates": []
        },
        "sysinfo": {
            "id": "XXXX",
            "cmsid": "102",
            "thirdpartid": "111",
            "thirdparttype": "1",
            "extendinfo": ""
        }
    };
    markerObject.geometry.coordinates[0] = $("#map-dialog-node-position").attr("lng");
    markerObject.geometry.coordinates[1] = $("#map-dialog-node-position").attr("lat");

    //调用室内地图接口，添加node
    g_oOutDoorMap.addMarker(markerObject);

    $('#map-dialog-node').modal('hide');
});

/**
 * @breif 显示添加节点dialog
 * 
 * @param id   所属图层ID 0-室外地图
 * @param lng  经度
 * @param lat  纬度
 */
function showAddNodeModal(id, lng, lat) {
    var position = "(" + lng + "," + lat + ")";
    // $("#markerlayoutid").val(id);
    $("#map-dialog-node-position").val(position);
    $("#map-dialog-node-position").attr({ "lng": lng, "lat": lat });
    $('#map-dialog-node').modal('show');
}

/**
 * @breif 显示错误信息
 * 
 * @param errorinfo  错误信息
 */
function fillErrorHtml(errorinfo) {
    var htmlinfo = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";
    return htmlinfo;
}