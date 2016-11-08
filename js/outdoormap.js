/**
 * @brief 室内地图对象
 */
var OutDoorMap = {
    createNew: function() {
        var map = {};

        //=====测试数据=====
        //启动加载的节点，测试数据
        map.m_geojson_MarkersData_onload = [{
            "type": "Feature",
            "properties": {
                "title": "car",
                "icon": "car",
                "message": "car",
                //"iconSize": [22, 30],
                "description": "car"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.524462890625, 31.234695711685304],
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }, {
            "type": "Feature",
            "properties": {
                "title": "marker",
                "icon": "car",
                "message": "marker",
                //"iconSize": [22, 30],
                "description": "marker"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.5158203125, 31.37189158092897]
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }, {
            "type": "Feature",
            "properties": {
                "title": "保安",
                "icon": "car",
                "message": "保安",
                //"iconSize": [22, 30],
                "description": "保安"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.59223632812499, 31.38151823530889]
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }];

        //事件触发的节点，测试数据
        map.m_geojson_MarkersData_onchange = [{
            "type": "Feature",
            "properties": {
                "title": "cinema",
                "icon": "cinema",
                "message": "cinema",
                //"iconSize": [22, 30],
                "description": "cinema"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.424462890625, 31.224695711685304],
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }, {
            "type": "Feature",
            "properties": {
                "title": "marker",
                "icon": "marker",
                "message": "marker",
                //"iconSize": [22, 30],
                "description": "marker"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.4158203125, 31.27189158092897]
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }, {
            "type": "Feature",
            "properties": {
                "title": "保安",
                "icon": "police",
                "message": "保安",
                //"iconSize": [22, 30],
                "description": "保安"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [121.49223632812499, 31.28151823530889]
            },
            "sysinfo": {
                "id": "XXXX",
                "cmsid": "102",
                "thirdpartid": "111",
                "thirdparttype": "1",
                "extendinfo": ""
            }
        }];

        //=====私有成员变量=====
        //mapboxgl地图对象
        var g_oOutdoormap = null;
        //是否已加载图标
        var g_bLoadMarkers = false;
        //marker数据对象
        var g_oCommonMarkersData = {
            "type": "FeatureCollection",
            "features": []
        };

        var g_oFlashMarkersData = null;

        //marker弹出框对象
        var g_oMarkerPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        //=====公共接口方法=====
        /**
         * @breif 初始化mapboxgl地图
         */
        map.initMap = function() {
            g_bLoadMarkers = false;
            g_oOutdoormap = new mapboxgl.Map({
                container: 'map_indoor', // container id
                style: 'style.json', //stylesheet location
                center: [121.4, 31.2], // starting position
                zoom: 12 // starting zoom
            });

            //区域绘制工具
            // var draw = mapboxgl.Draw({
            //     drawing: true,
            //     displayControlsDefault: false,
            //     controls: {
            //         polygon: true,
            //         trash: true
            //     }
            // });
            // g_oOutdoormap.addControl(draw);

            // var calcButton = document.getElementById('calculate');
            // calcButton.onclick = function() {
            //     var data = draw.getAll();
            //     if (data.features.length > 0) {
            //         var area = turf.area(data);
            //         // restrict to area to 2 decimal points
            //         var rounded_area = Math.round(area * 100) / 100;
            //         var answer = document.getElementById('calculated-area');
            //         answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
            //     } else {
            //         alert("Use the draw tools to draw a polygon!");
            //     }
            // };

            //启动后，加载marker
            g_oOutdoormap.on('load', function() {
                map.addMarkers(map.m_geojson_MarkersData_onload);

                //绘制图片
                // g_oOutdoormap.addSource("ID_IMAGE", {
                //     "type": "image",
                //     "url": "img/map.jpg",
                //     "coordinates": [
                //         [121.4, 31.2],
                //         [125.516, 31.2],
                //         [125.516, 33.936],
                //         [121.4, 33.936]
                //     ]
                // });

                // g_oOutdoormap.addLayer({
                //     "id": "ID_LAYER_IMAGE",
                //     "type": "raster",
                //     "source": "ID_IMAGE"
                // });
            });

            //监听鼠标移动消息，进行marker信息框的弹出                                                           
            g_oOutdoormap.on('mousemove', function(e) {
                if (g_bLoadMarkers) {
                    var features = g_oOutdoormap.queryRenderedFeatures(e.point, { layers: ['ID_LAYER_MARKERS'] });

                    if (!features.length) {
                        //恢复鼠标形状,并关闭marker信息框
                        //g_oOutdoormap.getCanvas().style.cursor = '';
                        g_oMarkerPopup.remove();
                        return;
                    }
                    //改变鼠标形状
                    g_oOutdoormap.getCanvas().style.cursor = 'pointer';

                    //弹出信息框
                    g_oMarkerPopup.setLngLat(features[0].geometry.coordinates)
                        .setHTML(features[0].properties.description)
                        .addTo(g_oOutdoormap);
                }
            });

            //监听鼠标点击消息，进行marker点击，居中处理
            g_oOutdoormap.on('click', function(e) {
                if (g_bLoadMarkers) {
                    var features = g_oOutdoormap.queryRenderedFeatures(e.point, { layers: ['ID_LAYER_MARKERS'] });
                    if (features.length) {
                        g_oOutdoormap.flyTo({ center: features[0].geometry.coordinates });
                    }
                }
            });
        };

        /**
         * @breif 添加markers
         * 
         * 本函数添加icon，添加自定义图片参考 https://www.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
         * 
         * @param features 节点数组
         */
        map.addMarkers = function(features) {
            g_oCommonMarkersData.features = g_oCommonMarkersData.features.concat(features);
            refreshMarkers();
        };

        /**
         * @breif 移除markers
         */
        map.removeMarkers = function() {
            g_oCommonMarkersData.features.length = 0;
            refreshMarkers();
        };

        //=====私有接口方法=====
        /**
         * @breif 刷新markers
         */
        function refreshMarkers() {
            if (g_bLoadMarkers) {
                g_oOutdoormap.removeLayer('ID_LAYER_MARKERS');
                g_oOutdoormap.removeSource('ID_SOURCE_COMMON_MARKERS');
                g_bLoadMarkers = false;
            }

            if (g_oCommonMarkersData) {
                //新建marker资源数据
                g_oOutdoormap.addSource("ID_SOURCE_COMMON_MARKERS", {
                    "type": "geojson",
                    "data": g_oCommonMarkersData
                });

                //新建地图图层，显示marker
                g_oOutdoormap.addLayer({
                    "id": "ID_LAYER_MARKERS",
                    "type": "symbol", //https://www.mapbox.com/mapbox-gl-style-spec/#layers-symbol
                    "source": "ID_SOURCE_COMMON_MARKERS",
                    "layout": {
                        "icon-image": "{icon}-15",
                        "text-field": "{title}",
                        "text-font": ["yahei"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top",
                        "icon-allow-overlap": true
                    },
                    'paint': { //https://www.mapbox.com/mapbox-gl-style-spec/#paint_symbol
                        'text-color': '#FF0000',
                        'text-halo-width': 2,
                        'text-halo-color': '#00FF00'
                    }
                });

                g_bLoadMarkers = true;
            }
        };

        return map;
    }
};

//室内地图全局对象
var g_oOutDoorMap = OutDoorMap.createNew();