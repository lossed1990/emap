//=====新增图层界面事件处理=====
var AddLayerDialog = {
    createNew: function() {
        var dialog = {};
        //=====私有成员变量=====
        /** UI对象 */
        var $m_inputAreaname = $("#map-dialog-map-areaname");
        var $m_inputFatherarea = $("#map-dialog-map-fatherarea");
        var $m_inputLayerFile = $("#map-dialog-map-inputmap");
        var $m_inputDescription = $("#map-dialog-map-description");
        var $m_treeParent = $("#parent-tree");
        //上传图层文件的原始宽高
        var m_nLayerFileWidth = 0;
        var m_nLayerFileHeight = 0;
        //当前选择的图层节点
        var m_treeCurrentSelect = null;

        dialog.init = function() {
            $m_treeParent.click(function(e) {
                //点击树形控件时，捕获消息不隐藏弹出菜单 //http://blog.csdn.net/yangding_/article/details/52856943
                e.stopPropagation();
            });

            $m_treeParent.on("changed.jstree", function(e, data) {
                console.log("The selected nodes are:");
                console.log(data.selected);

                m_treeCurrentSelect = data.selected;

            });


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
                    if (m_nLayerFileHeight == 0 || m_nLayerFileWidth == 0) {
                        //fillErrorHtml("图层添加失败,请稍后重试！");
                        toastr.error('图层添加失败,图层加载失败，请稍后重试！');
                        return;
                    }

                    var layerJson = {
                        "description": $m_inputDescription.val(),
                        "fatherid": $m_inputFatherarea.val(),
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
                    });
                });

                //$('#map-dialog-layer').modal('hide');
            });
        };

        /**
         * @breif 显示添加图层dialog
         * 
         * @param id   所属图层ID 0-室外地图
         * @param lng  经度
         * @param lat  纬度
         */
        dialog.showAddLayerModal = function() {
            $('#map-dialog-layer').modal('show');
        };

        /**
         * @brief 图层数据改变事件
         */
        dialog.onLayerDataChange = function(datamap) {
            refreshParentTree(datamap);
        }

        /**
         * @breif 检查上传参数信息
         */
        function checkParam() {
            if ($m_inputAreaname.val() == "") {
                fillErrorHtml("请输入图层名称");
                return false;
            }

            if ($m_inputFatherarea.val() == "") {
                fillErrorHtml("请选择所属图层");
                return false;
            }

            if ($m_inputLayerFile.val() == "") {
                fillErrorHtml("请选择地图文件");
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

        function refreshParentTree(datamap) {
            var datajson = [];
            var rootobject = { "id": "ROOT", "text": "ROOT", "children": [] }; //根节点对象
            var subobject = [{ 'ROOT': rootobject }]; //缓存子节点对象，用以构造节点树

            var layerid = null;
            var layerobject = null;
            for (layerid in datamap) {
                layerobject = datamap[layerid];

                if (layerobject.fatherid in subobject) {
                    var newobject = {};
                    newobject['id'] = layerobject.id;
                    newobject['text'] = layerobject.name;
                    newobject['children'] = [];

                    subobject[layerobject.id] = newobject;
                    subobject[layerobject.fatherid]['children'].push(newobject);
                }
            }

            datajson.push(rootobject);

            $m_treeParent.jstree({
                'core': {
                    'data': datajson
                }
            });
        }

        return dialog;
    }
};

//节点新增窗口全局对象
var g_oAddLayerDialog = AddLayerDialog.createNew();