/**
 * @brief 室内布防图对象
 */
var InDoorMap = {
    createNew: function() {
        var oreturn = {};

        //=====私有成员变量=====
        var map; //地图对象
        var m_currentlayoutid; //当前图层ID

        //是否进入添加图标状态
        var m_bAddMarkerState = false;

        //图层对象，可加载不同的图片，达到切换图层的效果 
        var layer = new ol.layer.Image({

        });

        var extent = [0, 0, 1920, 1080]; //图片默认区域坐标，会影响图片一开始的缩放值
        var projection = new ol.proj.Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: extent
        });

        //marker资源对象及marker图层对象
        var marker_source_node = new ol.source.Vector({});
        var marker_layer_node = new ol.layer.Vector({
            source: marker_source_node
        });

        //marker弹出式说明框
        var element = document.getElementById('popup');
        var popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [-5, -10]
        });

        //=====公共接口方法=====
        oreturn.initMap = function() {
            map = new ol.Map({
                layers: [
                    layer,
                    marker_layer_node
                ],

                overlays: [popup],

                target: 'map-indoor',
                view: new ol.View({
                    projection: projection,
                    center: ol.extent.getCenter(extent),
                    zoom: 2,
                    maxZoom: 5
                })
            });

            map.on('click', function(evt) {
                var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                if (feature) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);

                    var options = {
                        'animation': true,
                        'placement': 'top',
                        'html': true,
                        'content': "您点击了：" + feature.get('name')
                    };
                    $(element).popover(options);
                    $(element).popover('show');
                } else {
                    $(element).popover('destroy');

                    //如果此处没有marker，并且处于添加图标状态，则弹出新建图标窗口
                    if (m_bAddMarkerState) {
                        var coordinate = evt.coordinate; //获取地图内坐标	   
                        //alert(evt.pixel);    //浏览器坐标
                        //alert(coordinate);   //地图内坐标	     
                        //showAddNoteModal(m_currentlayoutid, coordinate);
                    }
                }
            });

            //鼠标移动事件，若经过marker，则改变鼠标形状；若存在弹出说明框，关闭之
            map.on('pointermove', function(e) {
                var pixel = map.getEventPixel(e.originalEvent);
                var hit = map.hasFeatureAtPixel(pixel);
                map.getTargetElement().style.cursor = hit ? 'pointer' : '';

                $(element).popover('destroy');
            });

            //修改鼠标初始化样式          
            map.getViewport().style.cursor = "grab";

            $(map.getViewport()).on('mousedown', function(e) {
                if (m_bAddMarkerState) {
                    map.getViewport().style.cursor = "crosshair";
                } else {
                    map.getViewport().style.cursor = "grabbing";
                }
            });

            $(map.getViewport()).on('mouseup', function(e) {
                if (2 == e.originalEvent.button) {
                    oreturn.leaveAddMarkerState();
                    if (g_oMapTool) {
                        g_oMapTool.restoreMarkerToolIcon();
                    }
                } else {
                    if (m_bAddMarkerState) {
                        map.getViewport().style.cursor = "crosshair";
                    } else {
                        map.getViewport().style.cursor = "grab";
                    }
                }
            });

            $("#map-indoor").on('mouseup', function(e) {
                if (2 == e.originalEvent.button) {
                    return;
                }
            });
        };

        oreturn.setMap = function(filepath, width, height) {
            if (!filepath || filepath == '') {
                layer.setSource(null);
            }

            var sourcemap = new ol.source.ImageStatic({
                url: filepath,
                projection: projection,
                imageExtent: [0, 0, width, height] //图片大小
            });

            layer.setSource(sourcemap);
        }

        oreturn.setCurrentLayoutId = function(id) {
            m_currentlayoutid = id;
        }

        oreturn.enterAddMarkerState = function() {
            m_bAddMarkerState = true;
            //$("#map-indoor").css("cursor", "crosshair");
            //map.getCanvas().style.cursor = "crosshair";
            map.getViewport().style.cursor = "crosshair";
        }

        oreturn.leaveAddMarkerState = function() {
            m_bAddMarkerState = false;
            //$("#map-indoor").css("cursor", "");
            //map.getCanvas().style.cursor = "";
            map.getViewport().style.cursor = "grab";
        }



        //=====私有接口方法=====


        return oreturn;
    }
};

//室内布防图对象
var g_oInDoorMap = InDoorMap.createNew();