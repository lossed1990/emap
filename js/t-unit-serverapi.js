//=======全局服务API接口类
var ServerApi = {
    createNew: function() {
        var api = {};

        /** url地址 */
        var m_fileServiceUrl = "http://192.168.2.26:9001/file/clientUploadImage.do";
        var m_GisServiceUrl = "http://192.168.2.76:8080/elaproxy/emap/UpdateLayer.w";
        var m_GetChildLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/GetChildLayer.r?parentid=";
        var m_DeleteLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/DeleteLayer.w?layerid=";
        var m_FindLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/SearchLayer.r?layername=";
        //图层数据监听者列表
        var m_listLayerDataChangeListener = [];
        //所有图层对象列表
        var m_gLayerObjectMap = {};
        //当前图层对象
        var m_gCurrentLayerObject = null;

        /**
         * @brief 向服务器请求上传图片
         */
        api.ajaxUploadImage = function(data, callback) {
            $.ajax({
                type: "POST",
                url: m_fileServiceUrl,
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                success: function(result) {
                    (callback && typeof(callback) === "function") && callback(result);
                },
                error: function() {
                    //fillErrorHtml("图层文件上传失败！");
                    toastr.error('图层文件上传失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 向服务器请求添加图层
         * 
         * @param layerjson 图层json参数
         */
        api.ajaxAddLayer = function(layerjson, callback) {
            $.ajax({
                type: "POST",
                url: m_GisServiceUrl,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(layerjson),
                dataType: "json",
                success: function(result) {
                    if (result.ok == 0) {
                        toastr.success("图层[" + layerjson.name + "]添加成功！");

                        //缓存新图层
                        layerjson['id'] = result.data[0];
                        addlayerObject(layerjson);

                        notifyLayerDataChange();
                        (callback && typeof(callback) === "function") && callback();
                    } else {
                        toastr.error('图层添加失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('图层获取失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 向服务器请求所有图层
         */
        api.ajaxGetAllLayers = function() {
            var requestUrl = m_GetChildLayerUrl + parentid;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        m_gLayerObjectMap = {};

                        var index = null;
                        for (index in result.data) {
                            addlayerObject(result.data[index]);
                        }
                        notifyLayerDataChange();
                        toastr.success('图层数据已更新！');
                    } else {
                        toastr.error('获取所有图层失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('获取所有图层失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 向服务器请求获取某节点所有子图层
         * 
         * @param parentid 父节点ID
         * @param clear    是否清空缓存图层数据
         */
        api.ajaxGetChildLayers = function(parentid, clear) {
            var requestUrl = m_GetChildLayerUrl + parentid;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        if (clear) {
                            m_gLayerObjectMap = {};
                        }
                        var index = null;
                        for (index in result.data) {
                            addlayerObject(result.data[index]);
                        }
                        notifyLayerDataChange();
                    } else {
                        toastr.error('子图层获取失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('子图层获取失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 向服务器请求删除某个图层
         * 
         * @param layerid 图层编号
         */
        api.ajaxDeleteLayer = function(layerid) {
            var requestUrl = m_DeleteLayerUrl + layerid;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        toastr.success("图层[" + m_gLayerObjectMap[layerid].name + "]删除成功！");
                        deleteLayerObject(layerid);
                        notifyLayerDataChange();
                    } else {
                        toastr.error('图层删除失败，' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('图层删除失败，请检查服务器及网络后重试！');
                }
            });
        };

        /** 
         * @brief 向服务器请求模糊检索图层信息
         * 
         * @param keyword  关键字
         * @param callback 检索回调函数  callback(param1) param1:图层对象数组
         */
        api.ajaxSearchLayers = function(keyword, callback) {
            var requestUrl = m_FindLayerUrl + keyword;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    var index = null;
                    if (result.ok == 0) {
                        (callback && typeof(callback) === "function") && callback(result.data);
                    } else {
                        toastr.error('模糊查找失败，' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('模糊查找失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 添加监听图层数据改变的对象
         * 
         * @param object 监听对象
         */
        api.addLayerDataChangeListener = function(object) {
            for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
                if (m_listLayerDataChangeListener[i] == object) {
                    return;
                }
            }

            m_listLayerDataChangeListener.push(object);
        };

        /**
         * @brief 删除监听图层数据改变的对象
         * 
         * @param object 监听对象
         */
        api.deleteLayerDataChangeListener = function(object) {
            for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
                if (m_listLayerDataChangeListener[i] == object) {
                    m_listLayerDataChangeListener.splice(i, 1);
                    return;
                }
            }
        };

        /**
         * @brief 根据图层编号获取图层对象
         * 
         * @param layerid 图层编号
         */
        api.getLayerObjectById = function(layerid) {
            return m_gLayerObjectMap[layerid];
        };

        /**
         * @brief 获取当前图层对象
         */
        api.getCurrentLayerObject = function() {
            return m_gCurrentLayerObject;
        };

        /**
         * @brief 设置当前图层对象
         * 
         * @param object 图层对象
         */
        api.setCurrentLayerObject = function(object) {
            m_gCurrentLayerObject = object;
        };

        //通知监听者图层数据改变
        function notifyLayerDataChange() {
            for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
                m_listLayerDataChangeListener[i].onLayerDataChange(m_gLayerObjectMap);
            }
        }

        //添加图层对象
        function addlayerObject(layerobject) {
            //判断id是否存在，存在先删除
            if (layerobject.id in m_gLayerObjectMap) {
                delete m_gLayerObjectMap[layerobject.id];
            }

            m_gLayerObjectMap[layerobject.id] = layerobject;
        }

        //删除图层对象
        function deleteLayerObject(layerid) {
            if (layerid in m_gLayerObjectMap) {
                delete m_gLayerObjectMap[layerid];
            }
        }

        return api;
    }
};

var g_oServerApi = ServerApi.createNew();