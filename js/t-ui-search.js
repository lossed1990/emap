//=====图层全局数据管理类=====
var SearchWindow = {
    createNew: function() {
        var wnd = {};
        //=====私有成员变量=====
        /** 界面html对象 */
        var $m_currentAreaPanel = $('.map-search-layer-current');
        var $m_rootLayerPanel = $('#map-search-panel-root');
        var $m_mapSearchInput = $("#map-search-input");
        var $m_mapSearchPanel = $("#map-search-panel");
        var $m_mapSearchPanelbase = $("#map-search-panelbase");
        var $m_mapSearchPanelresult = $("#map-search-panelresult");
        var $m_currentSearchPanel = $m_mapSearchPanelbase;
        //按拼音显示所有图层的panel对象
        var $scrollToContainer = $(".index-A");
        var $mainContainer = $('.layer-layer');

        var m_currentLayersArray = [];

        wnd.init = function() {
            /**检索区移动事件*/
            $("#map-search").draggable({ containment: "body", scroll: false, cursor: "move" });
            /**检索输入框点击事件*/
            $m_mapSearchInput.click(function() {
                $("#map-search").css("height", "400px");
                $m_mapSearchPanel.css("visibility", "visible");
                $m_currentSearchPanel.css("visibility", "visible");
            });
            $m_mapSearchInput.bind("input propertychange", function() {
                //构造关键字，去除首位空白符，将内部空白符替换为半角单个空格符
                var keyword = $.trim($m_mapSearchInput.val()).replace(/\s+/g, "*");
                if (keyword != "") {
                    keyword = "*" + keyword + "*";
                    //向服务器检索
                    g_oServerApi.ajaxSearchLayers(keyword, function(data) {
                        $m_mapSearchPanelresult.empty();
                        for (index in data) {
                            var layobject = data[index];
                            subHtml = "<a>" + layobject.name + "</a>";
                            $m_mapSearchPanelresult.append(subHtml);
                        }
                    });
                    showSearchResultPanel();
                } else {
                    showLayerBasePanel();
                }
            });
            /**检索按钮点击事件*/
            $("#map-search-btn").click(function() {
                $("#map-search").css("height", "400px");
                $m_mapSearchPanel.css("visibility", "visible");
                $m_currentSearchPanel.css("visibility", "visible");
            });
            /**检索显示区关闭按钮点击事件*/
            $(".map-search-layer-refresh").click(function() {
                //wnd.getRootChildLayers();
                //g_oServerApi.ajaxGetChildLayers("ROOT", true);
                //g_oServerApi.ajaxGetAllLayers();
                g_oServerApi.ajaxRefreshAllAreaNode();
            });
            /**拼音字母标签点击事件*/
            $(".layer-letter li").click(function() {
                var indexName = ".index-" + $(this).text();
                $scrollToContainer = $(indexName);
                $mainContainer.animate({    
                    scrollTop: $scrollToContainer.offset().top  - $mainContainer.offset().top + $mainContainer.scrollTop()
                }, 500);
            });

            /**判断是否需要隐藏检索区域*/
            (function() {
                var bIn = false;
                $("#map-search").mouseleave(function() { bIn = false; });
                $("#map-search").mouseenter(function() { bIn = true; });
                $("body").mousedown(function() {
                    if (!bIn) {
                        $("#map-search").css("height", "45px");
                        $m_mapSearchPanel.css("visibility", "hidden");
                        $m_currentSearchPanel.css("visibility", "hidden");
                    }
                });
            }());
            /**获取根图层信息*/
            //g_oServerApi.ajaxGetChildLayers("ROOT", true);
            //g_oServerApi.ajaxGetAllLayers();
        };

        //图层数据改变事件
        // wnd.onLayerDataChange = function(datamap) {
        //     refreshSearchPanel(datamap);
        // }

        //区域节点数据改变事件
        wnd.onAreaDataChange = function(data) {
            refreshSearchPanel(data);
        }

        /**
         * @brief 删除图层
         * 
         * @param layerid 图层ID
         */
        // wnd.deleteLayer = function(layerid) {
        //     var requestUrl = m_DeleteLayerUrl + layerid;
        //     $.ajax({
        //         type: "GET",
        //         url: requestUrl,
        //         success: function(result) {
        //             if (result.ok == 0) {
        //                 toastr.success("图层删除成功！");
        //             } else {
        //                 toastr.error('图层删除失败，' + result.errorinfo);
        //             }
        //         },
        //         error: function() {
        //             toastr.error('图层删除失败，请检查服务器及网络后重试！');
        //         }
        //     });
        // }

        //显示检索结果界面
        function showSearchResultPanel() {
            $m_mapSearchPanelbase.css("visibility", "hidden");
            if ($m_mapSearchPanel.css("visibility") == "visible") {
                $m_mapSearchPanelresult.css("visibility", "visible");
            }
            $m_currentSearchPanel = $m_mapSearchPanelresult;
        }

        //显示所有图层界面
        function showLayerBasePanel() {
            $m_mapSearchPanelresult.css("visibility", "hidden");
            if ($m_mapSearchPanel.css("visibility") == "visible") {
                $m_mapSearchPanelbase.css("visibility", "visible");
            }
            $m_currentSearchPanel = $m_mapSearchPanelbase;
        }

        //改变当前图层提示
        function setCurrentAreaInfo(nodeobject) {
            if (nodeobject) {
                g_oServerApi.setCurrentAreaObject(nodeobject);
                var htmlinfo = "当前区域：" + nodeobject.properties.title;
                if ($m_currentAreaPanel.text() != htmlinfo) {
                    $m_currentAreaPanel.text(htmlinfo);
                    //changeLayerMap(nodeobject.id);
                }
            }
        }

        //刷新检索区域
        // function refreshSearchPanel(objectmap) {
        //     //清空panel
        //     $m_rootLayerPanel.empty();
        //     $(".layer-layer dd").empty().hide();
        //     $(".layer-layer dt").hide();
        //     g_oServerApi.setCurrentLayerObject(null);

        //     //遍历所有图层，按拼音字幕排序并显示
        //     var layerid = null;
        //     var layerobject = null;
        //     var subHtml = null;
        //     for (layerid in objectmap) {
        //         layerobject = objectmap[layerid];

        //         if (layerobject.fatherid == "ROOT") {
        //             //将第一个根节点设置为当前图层
        //             if (!g_oServerApi.getCurrentLayerObject()) {
        //                 setCurrentLayerInfo(layerobject);
        //             }

        //             subHtml = "<a class='root-layer layerbtn' layerid='" + layerobject.id + "' title='" + layerobject.name + "'>" + layerobject.name + "</a>";
        //             $m_rootLayerPanel.append(subHtml);
        //         }

        //         var pinyin = wf.makePy(layerobject.name);
        //         if (pinyin && pinyin[0] && pinyin[0][0]) {
        //             var indexClassName = ".index-" + pinyin[0][0];
        //             var layerClassName = ".layer-" + pinyin[0][0];
        //             subHtml = "<li class='layerbtn' layerid='" + layerobject.id + "'>" + layerobject.name + "</li>";

        //             $(indexClassName).show();
        //             $(layerClassName).show();
        //             $(layerClassName).append(subHtml);
        //         }
        //     }

        // /**图层名称标签点击事件*/
        // $(".layerbtn").click(function() {
        //     var layerid = $(this).attr("layerid");
        //     changeLayerMap(layerid);
        // });
        // }

        //刷新检索区域
        function refreshSearchPanel(data) {
            //清空panel
            $(".layer-layer dd").empty().hide();
            $(".layer-layer dt").hide();
            g_oServerApi.setCurrentAreaObject(null);

            //遍历所有图层，按拼音字幕排序并显示
            var index = null;
            for (index in data) {
                var nodeobject = data[index];

                //将第一个根节点设置为当前图层
                if (!g_oServerApi.getCurrentAreaObject()) {
                    changeArea(nodeobject);
                }

                var pinyin = wf.makePy(nodeobject.properties.title);
                if (pinyin && pinyin[0] && pinyin[0][0]) {
                    var indexClassName = ".index-" + pinyin[0][0];
                    var layerClassName = ".layer-" + pinyin[0][0];
                    subHtml = "<li class='areabtn' layerid='" + nodeobject.id + "'>" + nodeobject.properties.title + "</li>";

                    $(indexClassName).show();
                    $(layerClassName).show();
                    $(layerClassName).append(subHtml);
                }
            }

            /**图层名称标签点击事件*/
            $(".areabtn").click(function() {
                var areaid = $(this).attr("layerid");
                var areaobject = g_oServerApi.getAreaObjectById(areaid);
                if (areaobject) {
                    changeArea(areaobject);
                } else {
                    toastr.error("区域节点信息获取失败！");
                }
            });
        }

        //改变区域节点
        function changeArea(nodeobject) {
            $m_rootLayerPanel.empty();
            setCurrentAreaInfo(nodeobject);

            //获取当前区域节点下的图层信息
            g_oServerApi.ajaxGetAreaLayers(nodeobject.id, function(data) {
                m_currentLayersArray = data;

                var index = null;
                for (index in data) {

                    var layerobject = data[index];
                    subHtml = "<a class='root-layer layerbtn' layerid='" + layerobject.id + "' title='" + layerobject.name + "'>" + layerobject.name + "</a>";
                    $m_rootLayerPanel.append(subHtml);

                    if (index == 0) {
                        //切换到第一个图层
                        changeLayerMap(layerobject.id);
                    }
                }

                /**图层名称标签点击事件*/
                $(".layerbtn").click(function() {
                    var layerid = $(this).attr("layerid");
                    changeLayerMap(layerid);
                });
            });
        }

        //改变图层
        function changeLayerMap(layerid) {
            var index = null;
            for (index in m_currentLayersArray) {
                var layerobject = m_currentLayersArray[index];
                if (layerobject.id == layerid) {
                    g_oInDoorMap.setMap("http://192.168.2.26:9001/file/getImage.do?fid=" + layerobject.img.imgid + "&type=0", layerobject.img.width, layerobject.img.height);
                    toastr.success("切换到图层[" + layerobject.name + "]");
                    break;
                }
            }
        }

        return wnd;
    }
};

//图层数据管理全局对象
var g_oSearchWindow = SearchWindow.createNew();