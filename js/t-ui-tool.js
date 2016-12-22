//=====工具栏区相关界面事件处理=====
/**
 * @brief 地图工具对象
 */
var MapToolWnd = {
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
        };

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
        };

        tool.showMapInfo = function() {
            $("#map-info").css("visibility", "visible");

            if ($(".map-info-indicators .icon-circle").attr("id") == "map-info-indicators-node") {
                $("#map-info-node").css("visibility", "visible");
            } else {
                $("#map-info-base").css("visibility", "visible");
            }
        };

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
        };

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
        };

        tool.restoreMarkerToolIcon = function() {
            $(".map-tools-ring .fa-globe").attr("title", "进入标注节点状态");
            $(".map-tools-ring .fa-globe").addClass("fa-map-marker");
            $(".map-tools-ring .fa-globe").removeClass("fa-globe");

            g_oOutDoorMap.leaveAddMarkerState();
            g_oInDoorMap.leaveAddMarkerState();
        };

        return tool;
    }
};

//地图工具全局对象
var g_oMapToolWnd = MapToolWnd.createNew();