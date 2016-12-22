//=======全局服务API接口类
var ServerApi = {
    createNew: function() {
        var api = {};

        /** url地址 */
        var m_GetChildLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/GetChildLayer.r?parentid=";
        var m_DeleteLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/DeleteLayer.w?layerid=";
        var m_FindLayerUrl = "http://192.168.2.76:8080/elaproxy/emap/SearchLayer.r?layername=";

        var m_listLayerDataChangeListener = [];

        var m_gLayerObjectMap = {};
        var m_gCurrentLayerObject = null;

        /**
         * @brief 获取某节点所有子图层
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
                        //callback.call(result.data); //回掉数据
                        var index = null;
                        for (index in result.data) {
                            addlayerObject(result.data[index]);
                        }
                        notifyLayerDataChange();
                    } else {
                        toastr.error('图层获取失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('图层获取失败,请检查服务器及网络后重试！');
                }
            });
        };

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
        }

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
        }

        api.addLayerDataChangeListener = function(object) {
            for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
                if (m_listLayerDataChangeListener[i] == object) {
                    return;
                }
            }

            m_listLayerDataChangeListener.push(object);
        }

        api.deleteLayerDataChangeListener = function(object) {
            for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
                if (m_listLayerDataChangeListener[i] == object) {
                    m_listLayerDataChangeListener.splice(i, 1);
                    return;
                }
            }
        }

        api.getLayerObjectById = function(layerid) {
            return m_gLayerObjectMap[layerid];
        }

        api.getCurrentLayerObject = function() {
            return m_gCurrentLayerObject;
        }

        api.setCurrentLayerObject = function(object) {
            m_gCurrentLayerObject = object;
        }

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

        function deleteLayerObject(layerid) {
            if (layerid in m_gLayerObjectMap) {
                delete m_gLayerObjectMap[layerid];
            }
        }

        return api;
    }
};

var g_oServerApi = ServerApi.createNew();