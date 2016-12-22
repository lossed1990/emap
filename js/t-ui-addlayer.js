//=====新增图层界面事件处理=====
var AddLayerDialog = {
    createNew: function() {
        var dialog = {};
        //=====私有成员变量=====
        var m_fileServiceUrl = "http://192.168.2.26:9001/file/clientUploadImage.do";
        var m_GisServiceUrl = "http://192.168.2.76:8080/elaproxy/emap/UpdateLayer.w";
        //缓存相关对象，以防多次遍历查找
        var $m_inputAreaname = $("#map-dialog-map-areaname");
        var $m_inputFatherarea = $("#map-dialog-map-fatherarea");
        var $m_inputLayerFile = $("#map-dialog-map-inputmap");
        var $m_inputDescription = $("#map-dialog-map-description");
        //上传图层文件的原始宽高
        var m_nLayerFileWidth = 0;
        var m_nLayerFileHeight = 0;

        dialog.initDialog = function() {
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

                $.ajax({
                    type: "POST",
                    url: m_fileServiceUrl,
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function(result) {
                        alert(result.errorcode);
                        alert(result.resultstr);
                        if (m_nLayerFileHeight == 0 || m_nLayerFileWidth == 0) {
                            fillErrorHtml("图层添加失败,请重试！");
                            return;
                        }

                        //获取参数，构造图层json对象
                        var layerJson = {
                            "description": $m_inputDescription.val(),
                            "fatherid": "ROOT",
                            "id": "ADD",
                            "img": {
                                "height": m_nLayerFileHeight,
                                "imgid": result.resultstr,
                                "width": m_nLayerFileWidth
                            },
                            "name": $m_inputAreaname.val()
                        };

                        //alert("m_nLayerFileWidth:" + m_nLayerFileWidth);

                        $.ajax({
                            type: "POST",
                            url: m_GisServiceUrl,
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(layerJson),
                            dataType: "json",
                            success: function(result) {
                                fillErrorHtml("图层添加成功！");
                                //$('#map-dialog-layer').modal('hide');
                            },
                            error: function() {
                                fillErrorHtml("图层添加失败！");
                            }
                        });
                    },
                    error: function() {
                        fillErrorHtml("图层文件上传失败！");
                    }
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
         * @breif 显示错误信息
         * 
         * @param errorinfo  错误信息
         */
        function fillErrorHtml(errorinfo) {
            var htmlinfo = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";
            $('#map-dialog-layer-worning').html(htmlinfo);
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

                    alert("图片的宽度为" + m_nLayerFileWidth + ",长度为" + m_nLayerFileHeight);
                };
            };
        }
        return dialog;
    }
};

//节点新增窗口全局对象
var g_oAddLayerDialog = AddLayerDialog.createNew();