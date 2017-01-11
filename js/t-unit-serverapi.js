//=======全局服务API接口类
var ServerApi = {
    createNew: function() {
        var api = {};

        /** url地址 */
        var m_fileServiceUrl = "http://192.168.2.26:9001/file/clientUploadImage.do";

        var m_serAddress = "http://192.168.2.26:9001/";
        var m_GisServiceUrl = m_serAddress + "elaproxy/emap/UpdateLayer.w";
        var m_GetChildLayerUrl = m_serAddress + "elaproxy/emap/GetChildLayer.r?parentid=";
        var m_DeleteLayerUrl = m_serAddress + "elaproxy/emap/DeleteLayer.w?layerid=";
        var m_FindLayerUrl = m_serAddress + "elaproxy/emap/SearchLayer.r?layername=";
        var m_GetLayerTreeUrl = m_serAddress + "elaproxy/emap/GetLayerTree.r";
        var m_UpdateNodeUrl = m_serAddress + "elaproxy/emap/UpdateNode.w";
        var m_DeleteNodeUrl = m_serAddress + "elaproxy/emap/DeleteNode.w";
        var m_GetAllNodeByTypeUrl = m_serAddress + "elaproxy/emap/GetAllNodeByType.r?nodetype=";
        var m_SearchNodeUrl = m_serAddress + "elaproxy/emap/SearchNode.r";


        // //图层数据监听者列表
        // var m_listLayerDataChangeListener = [];
        // //所有图层对象列表
        // var m_gLayerObjectMap = {};
        // //当前图层对象
        // var m_gCurrentLayerObject = null;


        //区域节点数据监听者列表
        var m_listAreaDataChangeListener = [];
        //所有区域节点对象列表
        var m_gAreaObjectMap = null;
        //当前区域对象
        var m_gCurrentAreaObject = null;

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
                        //layerjson['id'] = result.data[0];
                        //addlayerObject(layerjson);

                        //notifyLayerDataChange();
                        (callback && typeof(callback) === "function") && callback();
                    } else {
                        toastr.error('图层添加失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('图层添加失败,请检查服务器及网络后重试！');
                }
            });
        };

        // /**
        //  * @brief 向服务器请求所有图层
        //  */
        // api.ajaxGetAllLayers = function() {
        //     //var requestUrl = m_GetChildLayerUrl + parentid;
        //     api.ajaxGetChildLayers("ROOT", true);
        //     // $.ajax({
        //     //     type: "GET",
        //     //     url: m_GetLayerTreeUrl,
        //     //     success: function(result) {
        //     //         if (result.ok == 0) {
        //     //             m_gLayerObjectMap = {};

        //     //             var index = null;
        //     //             for (index in result.data) {
        //     //                 addlayerObject(result.data[index]);
        //     //             }
        //     //             notifyLayerDataChange();
        //     //             toastr.success('图层数据已更新！');
        //     //         } else {
        //     //             toastr.error('获取所有图层失败,' + result.errorinfo);
        //     //         }
        //     //     },
        //     //     error: function() {
        //     //         toastr.error('获取所有图层失败,请检查服务器及网络后重试！');
        //     //     }
        //     // });
        // };

        // /**
        //  * @brief 向服务器请求获取某节点所有子图层
        //  * 
        //  * @param parentid 父节点ID
        //  * @param clear    是否清空缓存图层数据
        //  */
        // api.ajaxGetChildLayers = function(parentid, clear) {
        //     var requestUrl = m_GetChildLayerUrl + parentid;
        //     $.ajax({
        //         type: "GET",
        //         url: requestUrl,
        //         success: function(result) {
        //             if (result.ok == 0) {
        //                 if (clear) {
        //                     m_gLayerObjectMap = {};
        //                 }
        //                 var index = null;
        //                 for (index in result.data) {
        //                     addlayerObject(result.data[index]);
        //                 }
        //                 //notifyLayerDataChange();
        //             } else {
        //                 toastr.error('子图层获取失败,' + result.errorinfo);
        //             }
        //         },
        //         error: function() {
        //             toastr.error('子图层获取失败,请检查服务器及网络后重试！');
        //         }
        //     });
        // };

        /**
         * @brief 向服务器请求获取某节点所有图层
         * 
         * @param parentid 父节点ID
         * @param callback 检索回调函数  callback(param1) param1:图层对象数组
         */
        api.ajaxGetAreaLayers = function(parentid, callback) {
            var requestUrl = m_GetChildLayerUrl + parentid;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        (callback && typeof(callback) === "function") && callback(result.data);
                    } else {
                        toastr.error('区域图层获取失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('区域图层获取失败,请检查服务器及网络后重试！');
                }
            });
        };

        /**
         * @brief 向服务器请求删除某个图层
         * 
         * @param layerid 图层编号
         */
        api.ajaxDeleteLayer = function(layername, layerid, callback) {
            var requestUrl = m_DeleteLayerUrl + layerid;
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        toastr.success("图层[" + layername + "]删除成功！");
                        (callback && typeof(callback) === "function") && callback();
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

        // /**
        //  * @brief 添加监听图层数据改变的对象
        //  * 
        //  * @param object 监听对象
        //  */
        // api.addLayerDataChangeListener = function(object) {
        //     for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
        //         if (m_listLayerDataChangeListener[i] == object) {
        //             return;
        //         }
        //     }

        //     m_listLayerDataChangeListener.push(object);
        // };

        // /**
        //  * @brief 删除监听图层数据改变的对象
        //  * 
        //  * @param object 监听对象
        //  */
        // api.deleteLayerDataChangeListener = function(object) {
        //     for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
        //         if (m_listLayerDataChangeListener[i] == object) {
        //             m_listLayerDataChangeListener.splice(i, 1);
        //             return;
        //         }
        //     }
        // };

        // /**
        //  * @brief 根据图层编号获取图层对象
        //  * 
        //  * @param layerid 图层编号
        //  */
        // api.getLayerObjectById = function(layerid) {
        //     return m_gLayerObjectMap[layerid];
        // };


        /**
         * @brief 根据区域编号获取区域节点对象
         * 
         * @param areaid 图层编号
         */
        api.getAreaObjectById = function(areaid) {
            var returnobject = null;
            var index = null;
            for (index in m_gAreaObjectMap) {
                var areaobject = m_gAreaObjectMap[index];
                if (areaid == areaobject.id) {
                    returnobject = areaobject;
                }
            }

            return returnobject;
        };


        // /**
        //  * @brief 获取当前图层对象
        //  */
        // api.getCurrentLayerObject = function() {
        //     return m_gCurrentLayerObject;
        // };

        // /**
        //  * @brief 设置当前图层对象
        //  * 
        //  * @param object 图层对象
        //  */
        // api.setCurrentLayerObject = function(object) {
        //     m_gCurrentLayerObject = object;
        // };

        /**
         * @brief 向服务器请求添加节点
         * 
         * @param nodejson 节点json参数
         */
        api.ajaxAddNode = function(nodejson, callback) {
            $.ajax({
                type: "POST",
                url: m_UpdateNodeUrl,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(nodejson),
                dataType: "json",
                success: function(result) {
                    if (result.ok == 0) {
                        toastr.success("节点[" + nodejson.properties.title + "]添加成功！");
                        (callback && typeof(callback) === "function") && callback(nodejson);
                    } else {
                        toastr.error('节点添加失败,' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('节点添加失败,请检查服务器及网络后重试！');
                }
            });
        };

        // /**
        //  * @brief 向服务器请求所有可以添加图层的节点信息
        //  * 
        //  * @param callback 检索回调函数  callback(param1) param1:图层对象数组
        //  */
        // api.ajaxGetAllAreaNode = function(callback) {
        //     var requestUrl = m_GetAllNodeByTypeUrl + 'area';
        //     $.ajax({
        //         type: "GET",
        //         url: requestUrl,
        //         success: function(result) {
        //             if (result.ok == 0) {
        //                 if (result.data.length == 0) {
        //                     toastr.error('尚未添加可配置室内布防图的节点！');
        //                 } else {
        //                     (callback && typeof(callback) === "function") && callback(result.data);
        //                 }
        //             } else {
        //                 toastr.error('节点获取失败，' + result.errorinfo);
        //             }
        //         },
        //         error: function() {
        //             toastr.error('连接失败,请检查服务器及网络后重试！');
        //         }
        //     });
        // }

        api.ajaxRefreshAllAreaNode = function() {
            var requestUrl = m_GetAllNodeByTypeUrl + 'area';
            $.ajax({
                type: "GET",
                url: requestUrl,
                success: function(result) {
                    if (result.ok == 0) {
                        if (result.data.length == 0) {
                            toastr.error('尚未添加可配置室内布防图的节点！');
                        } else {
                            m_gAreaObjectMap = result.data;
                            notifyAreaDataChange();
                        }
                    } else {
                        toastr.error('节点获取失败，' + result.errorinfo);
                    }
                },
                error: function() {
                    toastr.error('连接失败,请检查服务器及网络后重试！');
                }
            });
        }

        /**
         * @brief 添加监听区域节点数据改变的对象
         * 
         * @param object 监听对象
         */
        api.addAreaDataChangeListener = function(object) {
            for (var i = 0; i < m_listAreaDataChangeListener.length; i++) {
                if (m_listAreaDataChangeListener[i] == object) {
                    return;
                }
            }

            m_listAreaDataChangeListener.push(object);
        };

        /**
         * @brief 删除监听区域节点数据改变的对象
         * 
         * @param object 监听对象
         */
        api.deleteAreaDataChangeListener = function(object) {
            for (var i = 0; i < m_listAreaDataChangeListener.length; i++) {
                if (m_listAreaDataChangeListener[i] == object) {
                    m_listAreaDataChangeListener.splice(i, 1);
                    return;
                }
            }
        };

        /**
         * @brief 获取当前图层对象
         */
        api.getCurrentAreaObject = function() {
            return m_gCurrentAreaObject;
        };

        /**
         * @brief 设置当前图层对象
         * 
         * @param object 图层对象
         */
        api.setCurrentAreaObject = function(object) {
            m_gCurrentAreaObject = object;
        };

        // //通知监听者图层数据改变
        // function notifyLayerDataChange() {
        //     for (var i = 0; i < m_listLayerDataChangeListener.length; i++) {
        //         m_listLayerDataChangeListener[i].onLayerDataChange(m_gLayerObjectMap);
        //     }
        // }

        //通知监听者图层数据改变
        function notifyAreaDataChange() {
            for (var i = 0; i < m_listAreaDataChangeListener.length; i++) {
                m_listAreaDataChangeListener[i].onAreaDataChange(m_gAreaObjectMap);
            }
        }

        // //添加图层对象
        // function addlayerObject(layerobject) {
        //     //判断id是否存在，存在先删除
        //     if (layerobject.id in m_gLayerObjectMap) {
        //         delete m_gLayerObjectMap[layerobject.id];
        //     }

        //     m_gLayerObjectMap[layerobject.id] = layerobject;
        // }

        // //删除图层对象
        // function deleteLayerObject(layerid) {
        //     if (layerid in m_gLayerObjectMap) {
        //         delete m_gLayerObjectMap[layerid];
        //     }
        // }

        return api;
    }
};

var g_oServerApi = ServerApi.createNew();