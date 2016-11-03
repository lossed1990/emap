//=====全局变量=====
//mapboxgl地图对象
var g_oOutdoormap;
//是否已加载图标
var g_bLoadMarkers;
//marker弹出框对象
var g_oMarkerPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

//=====测试数据=====
//启动加载的节点，测试数据
var m_geojson_MarkersData_onload = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "title": "cinema",
            "icon": "car",
            "message": "cinema",
            //"iconSize": [22, 30],
            "description": "cinema"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [121.524462890625, 31.234695711685304],
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
        }
    }]
};

//事件触发的节点，测试数据
var m_geojson_MarkersData_onchange = {
    "type": "FeatureCollection",
    "features": [{
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
        }
    }]
};

//=====接口方法=====
/**
 * @breif 初始化mapboxgl地图
 */
function initOutdoorMap() {
    g_bLoadMarkers = false;
    g_oOutdoormap = new mapboxgl.Map({
        container: 'map_outdoor', // container id
        style: 'style.json', //stylesheet location
        center: [121.4, 31.2], // starting position
        zoom: 12 // starting zoom
    });

    //启动后，加载marker
    g_oOutdoormap.on('load', function() {
        addMarkersOnOutdoorMap(m_geojson_MarkersData_onload);
    });

    //监听鼠标移动消息，进行marker信息框的弹出
    g_oOutdoormap.on('mousemove', function(e) {
        var features = g_oOutdoormap.queryRenderedFeatures(e.point, { layers: ['ID_LAYER_MARKERS'] });

        if (!features.length) {
            //恢复鼠标形状,并关闭marker信息框
            g_oOutdoormap.getCanvas().style.cursor = '';
            g_oMarkerPopup.remove();
            return;
        }
        //改变鼠标形状
        g_oOutdoormap.getCanvas().style.cursor = 'pointer';

        //弹出信息框
        g_oMarkerPopup.setLngLat(features[0].geometry.coordinates)
            .setHTML(features[0].properties.description)
            .addTo(g_oOutdoormap);
    });

    //监听鼠标点击消息，进行marker点击，居中处理
    g_oOutdoormap.on('click', function(e) {
        var features = g_oOutdoormap.queryRenderedFeatures(e.point, { layers: ['ID_LAYER_MARKERS'] });
        if (features.length) {
            g_oOutdoormap.flyTo({ center: features[0].geometry.coordinates });
        }
    });
}

/**
 * @breif 添加markers
 * 
 * 本函数添加icon，添加自定义图片参考 https://www.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
 */
function addMarkersOnOutdoorMap(geojsonData) {
    //清空已加载的marker
    removeMarkersFromOutdoorMap();

    //新建marker资源数据
    g_oOutdoormap.addSource("ID_SOURCE_MARKERS", {
        "type": "geojson",
        "data": geojsonData
    });

    //新建地图图层，显示marker
    g_oOutdoormap.addLayer({
        "id": "ID_LAYER_MARKERS",
        "type": "symbol", //https://www.mapbox.com/mapbox-gl-style-spec/#layers-symbol
        "source": "ID_SOURCE_MARKERS",
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
    // 添加自定义图片 https://www.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
    // m_geojsonOutdoorMarker.features.forEach(function(marker) {
    //     // create a DOM element for the marker
    //     var el = document.createElement('div');
    //     el.className = 'marker';
    //     el.innerText = marker.properties.message;
    //     //el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
    //     el.style.backgroundImage = 'url(img/marker.png)';
    //     el.style.width = marker.properties.iconSize[0] + 'px';
    //     el.style.height = marker.properties.iconSize[1] + 'px';

    //     el.addEventListener('click', function() {
    //         window.alert(marker.properties.message);
    //     });

    //     // add marker to map
    //     new mapboxgl.Marker(el, { offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2] })
    //         .setLngLat(marker.geometry.coordinates)
    //         .addTo(g_oOutdoormap);
    // });
}

/**
 * @breif 移除markers
 */
function removeMarkersFromOutdoorMap() {
    if (g_bLoadMarkers) {
        g_oOutdoormap.removeLayer('ID_LAYER_MARKERS');
        g_oOutdoormap.removeSource('ID_SOURCE_MARKERS');
        g_bLoadMarkers = false;
    }
}