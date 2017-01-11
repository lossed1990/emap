//=====新增节点界面事件处理=====
var AddNodeDialog = {
    createNew: function() {
        var dialog = {};
        //=====私有成员变量=====
        //待添加节点的地图类型,1-indoor 0-outdoor
        var m_nMapType = 0;
        //ui
        var $m_inputNodeName = $("#map-dialog-node-name");
        var $m_inputNodeType = $("#map-dialog-node-type");
        var $m_inputNodePosition = $("#map-dialog-node-position");
        var $m_inputNodeDescription = $("#map-dialog-node-description");
        var $m_checkboxIsArea = $("#map-dialog-node-isarea");

        dialog.init = function() {
            /**
             * @brief 绑定节点类型选择下拉菜单事件
             */
            $('#map-dialog-node-menutype').on('click', 'li', function() {
                $m_inputNodeType.val($(this).text());
                $m_inputNodeType.attr("icon", $(this).attr("icon"));
            });

            /**
             * @brief 绑定提交按钮事件
             */
            $("#map-dialog-node-submit").click(function() {
                if ($m_inputNodeName.val() == "") {
                    toastr.error('请输入节点名称！');
                    return;
                }

                var nodetype = $m_inputNodeType.attr("icon");
                if ($m_checkboxIsArea.is(":checked")) {
                    nodetype = 'area';
                }

                //获取参数，构造节点json对象
                var nodejson = {
                    "type": "Feature",
                    "properties": {
                        "title": $m_inputNodeName.val(),
                        "icon": $m_inputNodeType.attr("icon"),
                        "description": $m_inputNodeDescription.val()
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": []
                    },
                    "id": "ADD",
                    "layerid": "ROOT",
                    "nodetype": nodetype
                };
                nodejson.geometry.coordinates[0] = $m_inputNodePosition.attr("lng");
                nodejson.geometry.coordinates[1] = $m_inputNodePosition.attr("lat");

                g_oServerApi.ajaxAddNode(nodejson, function(nodejson) {
                    if (m_nMapType === 0) { //添加室外节点
                        //调用室内地图接口，添加node
                        g_oOutDoorMap.addMarker(nodejson);
                    } else { //添加室内节点
                        g_oInDoorMap.addMarker(nodejson);
                    }

                    $('#map-dialog-node').modal('hide');
                    //成功请求相关输入框
                    $m_inputNodeName.val("");
                    $m_inputNodePosition.val("");
                    $m_inputNodePosition.attr("lng", "");
                    $m_inputNodePosition.attr("lat", "");
                    $m_inputNodeType.val("");
                    $m_inputNodeType.attr("icon", "");
                    $m_inputNodeDescription.val("");
                });
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
        // function fillErrorHtml(errorinfo) {
        //     var htmlinfo = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";
        //     $('#map-dialog-node-worning').html(htmlinfo);
        // }

        return dialog;
    }
};

//节点新增窗口全局对象
var g_oAddNodeDialog = AddNodeDialog.createNew();