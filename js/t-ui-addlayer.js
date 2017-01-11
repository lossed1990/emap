//=====新增图层界面事件处理=====
var AddLayerDialog = {
    createNew: function() {
        var dialog = {};
        //=====私有成员变量=====
        /** UI对象 */
        var $m_thisDialog = $('#map-dialog-layer');
        var $m_inputAreaname = $("#map-dialog-map-areaname");
        var $m_inputFatherarea = $("#map-dialog-map-fatherarea");
        var $m_inputLayerFile = $("#map-dialog-map-inputmap");
        var $m_inputDescription = $("#map-dialog-map-description");
        var $m_ulParentMenu = $("#map-dialog-layer-menutype");
        var m_curSelectParentId = null;
        //上传图层文件的原始宽高
        var m_nLayerFileWidth = 0;
        var m_nLayerFileHeight = 0;

        dialog.init = function() {
            /**
             * @brief 绑定节点类型选择下拉菜单事件
             */
            $m_ulParentMenu.on('click', 'li', function() {
                $m_inputFatherarea.val($(this).text());
                m_curSelectParentId = $(this).attr("nodeid");
            });

            //refreshParentMenu();

            /**
             * @brief 绑定提交按钮事件
             */
            $("#map-dialog-map-submit").click(function() {
                //检查参数
                if (!checkParam()) {
                    return;
                }

                //异步上传图片
                var layerFileInfo = $m_inputLayerFile[0].files[0];
                getLayerPictureSize(layerFileInfo);

                var data = new FormData();
                data.append('username', "gis");
                data.append('pvkey', "ek96VXZ0YmEwdTg9");
                data.append('upfile', layerFileInfo);

                g_oServerApi.ajaxUploadImage(data, function(result) {
                    if (m_nLayerFileHeight == 0 || m_nLayerFileWidth == 0 || m_curSelectParentId == null) {
                        toastr.error('图层添加失败,图层加载失败，请稍后重试！');
                        return;
                    }

                    var layerJson = {
                        "description": $m_inputDescription.val(),
                        "fatherid": m_curSelectParentId,
                        "id": "ADD",
                        "img": {
                            "height": m_nLayerFileHeight,
                            "imgid": result.resultstr,
                            "width": m_nLayerFileWidth
                        },
                        "name": $m_inputAreaname.val()
                    };

                    g_oServerApi.ajaxAddLayer(layerJson, function() {
                        //成功请求相关输入框
                        $m_inputAreaname.val("");
                        $m_inputFatherarea.val("");
                        $m_inputDescription.val("");
                        $m_inputLayerFile.val("");
                        m_curSelectParentId = null;
                    });
                });

                //$('#map-dialog-layer').modal('hide');
            });
        };

        dialog.onAreaDataChange = function(data) {
            refreshParentMenu(data);
        };

        /**
         * @breif 显示添加图层dialog
         * 
         * @param id   所属图层ID 0-室外地图
         * @param lng  经度
         * @param lat  纬度
         */
        dialog.showAddLayerModal = function() {
            $m_thisDialog.modal('show');
        };

        /**
         * @breif 检查上传参数信息
         */
        function checkParam() {
            if ($m_inputAreaname.val() == "") {
                toastr.error('请输入图层名称！');
                return false;
            }

            if ($m_inputFatherarea.val() == "") {
                toastr.error('请选择所属图层！');
                return false;
            }

            if ($m_inputLayerFile.val() == "") {
                toastr.error('请选择地图文件！');
                return false;
            }

            return true;
        }

        /**
         * @breif 检查上传参数信息
         */
        function getLayerPictureSize(fileInfo) {
            var reader = new FileReader();
            reader.readAsDataURL(fileInfo);
            reader.onload = function(theFile) {　　
                var image = new Image();
                image.src = theFile.target.result;
                image.onload = function() {　　

                    m_nLayerFileWidth = this.width;
                    m_nLayerFileHeight = this.height;

                    //alert("图片的宽度为" + m_nLayerFileWidth + ",长度为" + m_nLayerFileHeight);
                };
            };
        }

        function refreshParentMenu(data) {
            $m_ulParentMenu.empty();

            var index = null;
            for (index in data) {
                var nodeobject = data[index];
                var subHtml = "<li nodeid='" + nodeobject.id + "'><a href='#'><i class='fa fa-bank fa-fw'></i>&nbsp;" + nodeobject.properties.title + "</a></li>";
                $m_ulParentMenu.append(subHtml);
            }
            // g_oServerApi.ajaxGetAllAreaNode(function(data) {
            //     $m_ulParentMenu.empty();
            //     for (index in data) {
            //         var nodeobject = data[index];
            //         var subHtml = "<li icon='fa-bank'><a href='#'><i class='fa fa-bank fa-fw' nodeid='" + nodeobject.id + "'></i>&nbsp;" + nodeobject.properties.title + "</a></li>";
            //         $m_ulParentMenu.append(subHtml);
            //     }
            // });
        }

        return dialog;
    }
};

//节点新增窗口全局对象
var g_oAddLayerDialog = AddLayerDialog.createNew();