//=====新增节点界面事件处理=====
var AddNodeDialog = {
    createNew: function() {
        var dialog = {};
        //=====私有成员变量=====
        //待添加节点的地图类型,1-indoor 0-outdoor
        var m_nMapType = 0;

        dialog.init = function() {
            /**
             * @brief 绑定节点类型选择下拉菜单事件
             */
            $('#map-dialog-node-menutype').on('click', 'li', function() {
                $("#map-dialog-node-type").val($(this).text());
                $("#map-dialog-node-type").attr("icon", $(this).attr("icon"));
            });

            /**
             * @brief 绑定提交按钮事件
             */
            $("#map-dialog-node-submit").click(function() {
                if ($("#map-dialog-node-name").val() == "") {
                    fillErrorHtml("请输入节点名称");
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

                if (m_nMapType === 0) { //添加室外节点
                    //调用室内地图接口，添加node
                    g_oOutDoorMap.addMarker(markerObject);
                } else { //添加室内节点
                    g_oInDoorMap.addMarker(markerObject);
                }

                $('#map-dialog-node').modal('hide');
            });
        };

        /**
         * @breif 显示添加节点dialog
         * 
         * @param id   所属图层ID 0-室外地图
         * @param lng  经度
         * @param lat  纬度
         */
        dialog.showAddNodeModal = function(type, id, lng, lat) {
            m_nMapType = type;
            var position = "(" + lng + "," + lat + ")";
            $("#map-dialog-node-position").val(position);
            $("#map-dialog-node-position").attr({ "lng": lng, "lat": lat });
            $('#map-dialog-node').modal('show');
        };

        /**
         * @breif 显示错误信息
         * 
         * @param errorinfo  错误信息
         */
        function fillErrorHtml(errorinfo) {
            var htmlinfo = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";
            $('#map-dialog-node-worning').html(htmlinfo);
        }

        return dialog;
    }
};

//节点新增窗口全局对象
var g_oAddNodeDialog = AddNodeDialog.createNew();