/**
 * @brief 室内布防图对象
 */
var InDoorMap = {
    createNew: function() {
        var map = {};

        //=====私有成员变量=====
        var m_oOLMap; //地图对象
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
        map.init = function() {
            m_oOLMap = new ol.Map({
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

            m_oOLMap.on('click', function(evt) {
                var feature = m_oOLMap.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                if (feature) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);

                    var options = {
                        'animation': true,
                        'placement': 'top',
                        'title': 'dsadas',
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
                        g_oAddNodeDialog.showAddNodeModal(1, 0, coordinate[0], coordinate[1]);
                    }
                }
            });

            var $mapViewport = m_oOLMap.getViewport();
            //鼠标移动事件，若经过marker，则改变鼠标形状；若存在弹出说明框，关闭之
            m_oOLMap.on('pointermove', function(e) {
                //var pixel = m_oOLMap.getEventPixel(e.originalEvent);
                //var hit = m_oOLMap.hasFeatureAtPixel(pixel);
                // m_oOLMap.getTargetElement().style.cursor = hit ? 'pointer' : '';

                //$(element).popover('destroy');
                var feature = m_oOLMap.forEachFeatureAtPixel(e.pixel, function(feature) {
                    return feature;
                });
                if (feature) {
                    $mapViewport.style.cursor = "pointer";
                } else {
                    if (!m_bAddMarkerState) {
                        $($mapViewport).css("cursor", "url('img/grab.ico'),auto");
                    } else {
                        $mapViewport.style.cursor = "crosshair";
                    }
                }
            });

            //修改鼠标初始化样式      
            $($mapViewport).css("cursor", "url('img/grab.ico'),auto");

            $($mapViewport).on('mousedown', function(e) {
                if (m_bAddMarkerState) {
                    m_oOLMap.getViewport().style.cursor = "crosshair";
                } else {
                    $($mapViewport).css("cursor", "url('img/grabbing.ico'),auto");
                }
            });

            $($mapViewport).on('mouseup', function(e) {
                if (2 == e.originalEvent.button) {
                    map.leaveAddMarkerState();
                    if (g_oMapToolWnd) {
                        g_oMapToolWnd.restoreMarkerToolIcon();
                    }
                } else {
                    if (m_bAddMarkerState) {
                        m_oOLMap.getViewport().style.cursor = "crosshair";
                    } else {
                        $($mapViewport).css("cursor", "url('img/grab.ico'),auto");
                    }
                }
            });

            // $($mapViewport).on('mousemove', function(e) {
            //     var feature = m_oOLMap.forEachFeatureAtPixel(e.pixel, function(feature) {
            //         return feature;
            //     });
            //     if (feature) {
            //         $mapViewport.style.cursor = "pointer";
            //     } else {
            //         if (!m_bAddMarkerState) {
            //             $($mapViewport).css("cursor", "url('img/grab.ico'),auto");
            //         } else {
            //             $mapViewport.style.cursor = "crosshair";
            //         }
            //     }
            // });

            $("#map-indoor").on('mouseup', function(e) {
                if (2 == e.originalEvent.button) {
                    return;
                }
            });
        };

        map.setMap = function(filepath, width, height) {
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

        map.setCurrentLayoutId = function(id) {
            m_currentlayoutid = id;
        }

        map.enterAddMarkerState = function() {
            m_bAddMarkerState = true;
            m_oOLMap.getViewport().style.cursor = "crosshair";
        }

        map.leaveAddMarkerState = function() {
            m_bAddMarkerState = false;
            var $mapViewport = m_oOLMap.getViewport();
            $($mapViewport).css("cursor", "url('img/grab.ico'),auto");
        }

        map.addMarker = function(marker) {
            var marker_style = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'img/node_marker/0.png' //此处不支持gif，解决办法http://www.2cto.com/kf/201511/450555.html
                }),
                text: new ol.style.Text({
                    text: marker.properties.title,
                    textBaseline: 'top',
                    offsetY: 20,
                    fill: new ol.style.Fill({ color: [255, 0, 0, 255] })
                })
            });

            //marker_layer_node.setStyle(marker_style);
            //map.addLayer(marker_layer_node);

            //m_markerList.push(marker_layer_node);

            //创建位置对象
            var pointFeature = new ol.Feature({
                geometry: new ol.geom.Point(marker.geometry.coordinates),
                name: marker.properties.title
            });
            pointFeature.setStyle(marker_style);

            //添加marker
            marker_source_node.addFeature(pointFeature);
        }


        //=====私有接口方法=====


        return map;
    }
};

//室内布防图对象
var g_oInDoorMap = InDoorMap.createNew();