/**
 * Define a namespace for the application.
 */
var app = {};


/**
 * @constructor
 * @extends {ol.interaction.Pointer}
 */
app.Drag = function() {

  ol.interaction.Pointer.call(this, {
    handleDownEvent: app.Drag.prototype.handleDownEvent,
    handleDragEvent: app.Drag.prototype.handleDragEvent,
    handleMoveEvent: app.Drag.prototype.handleMoveEvent,
    handleUpEvent: app.Drag.prototype.handleUpEvent
  });

  /**
   * @type {ol.Pixel}
   * @private
   */
  this.coordinate_ = null;

  /**
   * @type {string|undefined}
   * @private
   */
  this.cursor_ = 'pointer';

  /**
   * @type {ol.Feature}
   * @private
   */
  this.feature_ = null;

  /**
   * @type {string|undefined}
   * @private
   */
  this.previousCursor_ = undefined;

};
ol.inherits(app.Drag, ol.interaction.Pointer);


/**
 * 判断鼠标点击点是否选中某个marker，选中返回true，并触发drag事件；
 * @param {ol.MapBrowserEvent} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
app.Drag.prototype.handleDownEvent = function(evt) {
  var map = evt.map;

  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature) {
        return feature;
      });

  if (feature) {
    this.coordinate_ = evt.coordinate;
    this.feature_ = feature;
  }

  return !!feature;
};


/**
 * @param {ol.MapBrowserEvent} evt Map browser event.
 */
app.Drag.prototype.handleDragEvent = function(evt) {
  var deltaX = evt.coordinate[0] - this.coordinate_[0];
  var deltaY = evt.coordinate[1] - this.coordinate_[1];

  var geometry = /** @type {ol.geom.SimpleGeometry} */
      (this.feature_.getGeometry());
  geometry.translate(deltaX, deltaY);

  this.coordinate_[0] = evt.coordinate[0];
  this.coordinate_[1] = evt.coordinate[1];
  
  var log = "this.coordinate_[0]:" + this.coordinate_[0] + ",this.coordinate_[1]" + this.coordinate_[1] + ",x:" + deltaX + ",y:" + deltaY;
  console.log(log);
};


/**
 * 判断鼠标是否经过某个marker，若经过，则改变鼠标样式；
 * @param {ol.MapBrowserEvent} evt Event.
 */
app.Drag.prototype.handleMoveEvent = function(evt) {
  if (this.cursor_) {
    var map = evt.map;
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });
    var element = evt.map.getTargetElement();
    if (feature) {
      if (element.style.cursor != this.cursor_) {
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    }
  }
};


/**
 * @return {boolean} `false` to stop the drag sequence.
 */
app.Drag.prototype.handleUpEvent = function() {
  this.coordinate_ = null;
  this.feature_ = null;
  return false;
};






//==============================================

var map; //地图对象
var m_currentlayoutid;  //当前图层ID
//var m_markerList = new Array();

//图层对象，可加载不同的图片，达到切换图层的效果 
var layer = new ol.layer.Image({

});

//marker资源对象及marker图层对象	
//var marker_source_hostnode = new ol.source.Vector({});
//var marker_layer_hostnode = new ol.layer.Vector({
//    source: marker_source_hostnode,
//    style: new ol.style.Style({
//        image: new ol.style.Icon({
//            src: 'img/node_marker/0.png'   //此处不支持gif，解决办法http://www.2cto.com/kf/201511/450555.html
//        }),
//		text: new ol.style.Text({
//		    text: '123',
//			textBaseline: 'top',
//			offsetY: 20,
//			fill: new ol.style.Fill({color: [255,0,0,255]})
//		})
//    })
//});

//var marker_source_cameranode = new ol.source.Vector({});
//var marker_layer_cameranode = new ol.layer.Vector({
//    source: marker_source_cameranode,
//    style: new ol.style.Style({
//        image: new ol.style.Icon(({
//            src: 'img/marker.png'
//        }))
//    })
//});

var extent = [0, 0, 1920, 1080]; //图片默认区域坐标，会影响图片一开始的缩放值
var projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent
});

//var sourcemap = new ol.source.ImageStatic({
//    //  attributions: '? <a href="http://xkcd.com/license.html">xkcd</a>',
//    url: '研发测试机房结构平面图.bmp', //'http://imgs.xkcd.com/comics/online_communities.png',
//    projection: projection,
//    imageExtent: [0, 0, 789, 834] //图片大小
//});

//var sourcemap1 = new ol.source.ImageStatic({
//    //  attributions: '? <a href="http://xkcd.com/license.html">xkcd</a>',
//    url: '1.bmp', //'http://imgs.xkcd.com/comics/online_communities.png',
//    projection: projection,
//    imageExtent: [0, 0, 1142, 796] //图片大小
//});

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
	
/**
 * @breif 初始化布防图
 */
function initIndoorMap() {
   

    map = new ol.Map({
        //controls: ol.control.defaults({
        //    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        //        collapsible: false
        //    })
        //}).extend([
        //    //new ol.control.FullScreen({
        //        //target: 'ces'
        //        //source: 'ces'
        //    //}), //全屏按钮
        //    //new ol.control.OverviewMap() //overmap
        //]),

        interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragRotateAndZoom() //按住shift可以旋转
			//new app.Drag()
			
        ]),

        layers: [
            layer,
            marker_layer_node
            //marker_layer_cameranode
        ],
		
		overlays: [popup],

        target: 'map_indoor',
        view: new ol.View({
            projection: projection,
            center: ol.extent.getCenter(extent),
            zoom: 2,
            maxZoom: 4
        })
    });
	
    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature) {
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
			if(isAddMarkerState()){
                var coordinate = evt.coordinate;  //获取地图内坐标	   
		        //alert(evt.pixel);    //浏览器坐标
		        //alert(coordinate);   //地图内坐标	     
                showAddNoteModal(m_currentlayoutid,coordinate);			
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
}

/**
 * @brief 判断是否加载土层及鼠标状态，决定是否点击添加marker
 */
function isAddMarkerState(){
    if(layer.getSource()){
        var wndObj=document.getElementsByTagName("body");
	    var currentState = wndObj[0].style.cursor;
	    if(currentState === 'crosshair'){
	        return true;
	    }
	}
	
	return false;
}

/**
* @breif 添加marker
*/
function addMarkerOnIndoorMap(markername,type,point){
    
	var marker_style = new ol.style.Style({
	    image: new ol.style.Icon({
			src: 'img/node_marker/0.png'   //此处不支持gif，解决办法http://www.2cto.com/kf/201511/450555.html
		}),
		text: new ol.style.Text({
			text: markername,
			textBaseline: 'top',
			offsetY: 20,
			fill: new ol.style.Fill({color: [255,0,0,255]})
		})
	});
	
	//marker_layer_node.setStyle(marker_style);
	//map.addLayer(marker_layer_node);
	
	//m_markerList.push(marker_layer_node);
	
	//创建位置对象
    var pointFeature = new ol.Feature({
        geometry: new ol.geom.Point(point),
		 name: markername
    });
	pointFeature.setStyle(marker_style);
	
	//添加marker
    marker_source_node.addFeature(pointFeature);
}

/**
* @breif 清除所有marker
*/
function removeAllMarkerOnIndoorMap(){
    //marker_source_hostnode.clear(true);
    //marker_source_cameranode.clear(true);
	marker_source_node.clear(true);
	
	//for(var i=0; i < m_markerList.length; ++i) {
	//    map.removeLayer(m_markerList[i]);
	//}
	
	//m_markerList = [];
}

/**
 * @brief 设置地图图层 
 */
function setMap(filepath,width,height){
    
	if(!filepath || filepath == '') {
	    layer.setSource(null);
	}
	
	var fileurl = "indoormapfile/" + filepath;

    var sourcemap = new ol.source.ImageStatic({
   
		url: fileurl, 
		projection: projection,
		imageExtent: [0, 0, width, height] //图片大小
	});
	
    layer.setSource(sourcemap);
}

/**
 * @brief 设置当前图层ID
 */
function setCurrentLayoutId(id){
    m_currentlayoutid = id;
}

/**
 * @breif 请求添加地图节点至数据库
 */
//function requestAddIndoorMarker(type,position) {	
//    //var urlstr = "mapunit/configunit/add_indoor_marker.php?position=" + position;
//	var datastr = "layoutid=" + m_currentlayoutid + "&type=" + type + "&position=" + position;
//	$.ajax({
//	    type: "post",
//		url: "mapunit/configunit/add_indoor_marker.php",
//		data: datastr,
//		success: function (result) {   
//			var ok = result.getElementsByTagName("ok")[0].childNodes[0].nodeValue;
//			var errorinfo = result.getElementsByTagName("errorinfo")[0].childNodes[0].nodeValue;
//			var htmlinfo;
//			if(ok == 0) { //success
//			    //var count = result.getElementsByTagName("count")[0].childNodes[0].nodeValue;
//				//var htmlmenu = "";
//				//for(i=0; i < count; i++)
//				//{
//				//    var areaname = result.getElementsByTagName("area")[i].childNodes[0].nodeValue;
//				    //htmlmenu = htmlmenu + "<li><a onclick='requestChangeIndoorMap(&#39" + areaname + "&#39)'>" + areaname + "</a></li>";
//				//	htmlmenu = htmlmenu + "<li><a>" + areaname + "</a></li>";
//				//}
//
//				//var htmlmenu = "<li><a onclick='requestChangeIndoorMap(&#39网点1&#39)'>网点1</a></li>";
//			    //$('#menu-indoor-area').html(htmlmenu);	
//
//               htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-success'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-success-close'>&times;</button><strong>提示！</strong>" + errorinfo + "</div>";	                          	             				
//			} else {
//			    htmlinfo = "<div id='div-addindoormap-worning' class='alert alert-warning'><button type='button' class='close' data-dismiss='alert' id='btn-addindoormap-worning-close'>&times;</button><strong>警告！</strong>" + errorinfo + "</div>";	             
//            }	
//   
//			$('#div-worning').html(htmlinfo);			
//		}
//	});
//}






























// //添加自定义按钮http://openlayers.org/en/v3.15.1/examples/custom-controls.html
// //{---------------------------------------------------------------------------
// /**
//  * Define a namespace for the application.
//  */
// window.app = {};
// var app = window.app;


// //
// // Define rotate to north control.
// //
// /**
//  * @constructor
//  * @extends {ol.control.Control}
//  * @param {Object=} opt_options Control options.
//  */
// app.RotateNorthControl = function(opt_options) {

//     var options = opt_options || {};

//     var button = document.createElement('button');
//     button.innerHTML = 'N';

//     var this_ = this;
//     var handleRotateNorth = function() {
//         this_.getMap().getView().setRotation(0);
//     };

//     button.addEventListener('click', handleRotateNorth, false);
//     button.addEventListener('touchstart', handleRotateNorth, false);

//     var element = document.createElement('div');
//     element.className = 'rotate-north ol-unselectable ol-control';
//     element.appendChild(button);

//     ol.control.Control.call(this, {
//         element: element,
//         target: options.target
//     });
// };

// ol.inherits(app.RotateNorthControl, ol.control.Control);
// //---------------------------------------------------------------------------}



// //var extent = [0, 0, 1024, 968];
// var extent = [0, 0, 1142, 796]; //图片大小
// var projection = new ol.proj.Projection({
//     code: 'xkcd-image',
//     units: 'pixels',
//     extent: extent
// });

// //画图形相关
// //{---------------------------------------------------
// var source = new ol.source.Vector({ wrapX: false });

// var vector = new ol.layer.Vector({
//     source: source,
//     style: new ol.style.Style({
//         fill: new ol.style.Fill({
//             color: 'rgba(255, 255, 255, 0.2)'
//         }),
//         stroke: new ol.style.Stroke({
//             color: '#ffcc33',
//             width: 2
//         }),
//         image: new ol.style.Circle({
//             radius: 7,
//             fill: new ol.style.Fill({
//                 color: '#ffcc33'
//             })
//         })
//     })
// });
// //---------------------------------------------------}




// var sourcemap = new ol.source.ImageStatic({
//     //  attributions: '? <a href="http://xkcd.com/license.html">xkcd</a>',
//     url: '研发测试机房结构平面图.bmp', //'http://imgs.xkcd.com/comics/online_communities.png',
//     projection: projection,
//     imageExtent: extent
// });

// var sourcemap1 = new ol.source.ImageStatic({
//     //  attributions: '? <a href="http://xkcd.com/license.html">xkcd</a>',
//     url: '1.bmp', //'http://imgs.xkcd.com/comics/online_communities.png',
//     projection: projection,
//     imageExtent: extent
// });

// var layer = new ol.layer.Image({
//     //source: sourcemap;        
// });



// var map = new ol.Map({
//     //添加自定义按钮http://openlayers.org/en/v3.15.1/examples/custom-controls.html
//     //{---------------------------------------------------------------------------
//     controls: ol.control.defaults({
//         attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
//             collapsible: false
//         })
//     }).extend([
//         new app.RotateNorthControl(), //自定义按钮
//         new ol.control.FullScreen(), //全屏按钮
//         new ol.control.OverviewMap() //overmap
//     ]),

//     interactions: ol.interaction.defaults().extend([
//         new ol.interaction.DragRotateAndZoom() //按住shift可以旋转
//     ]),
//     //---------------------------------------------------------------------------}

//     layers: [layer,
//         //new ol.layer.Image({
//         //    source: sourcemap;
//         //  //new ol.source.ImageStatic({
//         //      ////  attributions: '? <a href="http://xkcd.com/license.html">xkcd</a>',
//         //      //  url: '1.bmp',//'http://imgs.xkcd.com/comics/online_communities.png',
//         //      //  projection: projection,
//         //      //  imageExtent: extent
//         //    //})
//         //}),
//         vector
//     ],

//     target: 'map_indoor',
//     view: new ol.View({
//         projection: projection,
//         center: ol.extent.getCenter(extent),
//         zoom: 2,
//         maxZoom: 4
//     })
// });



// //{--------------------------------------------------
// //框选功能 ctrl+鼠标左键 款选颜色参考.ol-dragbox的设置
// //参考http://openlayers.org/en/v3.15.1/examples/box-selection.html 
// // a normal select interaction to handle click
// var select = new ol.interaction.Select();
// map.addInteraction(select);

// var selectedFeatures = select.getFeatures();

// // a DragBox interaction used to select features by drawing boxes
// var dragBox = new ol.interaction.DragBox({
//     condition: ol.events.condition.platformModifierKeyOnly
// });

// map.addInteraction(dragBox);

// var infoBox = document.getElementById('info');

// dragBox.on('boxend', function() {
//     // features that intersect the box are added to the collection of
//     // selected features, and their names are displayed in the "info"
//     // div
//     //将框选出的国家名称显示到控件<div id="info">上，后期需要选择出选中的marker
//     var info = [];
//     var extent = dragBox.getGeometry().getExtent();
//     vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
//         selectedFeatures.push(feature);
//         info.push(feature.get('name'));
//     });
//     if (info.length > 0) {
//         infoBox.innerHTML = info.join(', ');
//     }
// });

// // clear selection when drawing a new box and when clicking on the map
// dragBox.on('boxstart', function() {
//     selectedFeatures.clear();
//     infoBox.innerHTML = '&nbsp;';
// });
// map.on('click', function() {
//     selectedFeatures.clear();
//     infoBox.innerHTML = '&nbsp;';
// });
// //---------------------------------------------------} 














// //bootstrap风格按钮http://openlayers.org/en/v3.15.1/examples/button-title.html -------------------------
// //$('.ol-zoom-in, .ol-zoom-out').tooltip({
// //    placement: 'right'
// //});

// //$('.btn-default').tooltip({
// //    placement: 'right',
// //});
// //------------------------------------------------------------------------------------------------------






// //画图形相关
// //{---------------------------------------------------
// var typeSelect = document.getElementById('type');

// var draw; // global so we can remove it later
// function addInteraction() {
//     var value = typeSelect.value;
//     if (value !== 'None') {
//         var geometryFunction, maxPoints;
//         if (value === 'Square') {
//             value = 'Circle';
//             geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
//         } else if (value === 'Box') {
//             value = 'LineString';
//             maxPoints = 2;
//             geometryFunction = function(coordinates, geometry) {
//                 if (!geometry) {
//                     geometry = new ol.geom.Polygon(null);
//                 }
//                 var start = coordinates[0];
//                 var end = coordinates[1];
//                 geometry.setCoordinates([
//                     [start, [start[0], end[1]], end, [end[0], start[1]], start]
//                 ]);
//                 return geometry;
//             };
//         }
//         draw = new ol.interaction.Draw({
//             source: source,
//             type: /** @type {ol.geom.GeometryType} */ (value),
//             geometryFunction: geometryFunction,
//             maxPoints: maxPoints
//         });
//         map.addInteraction(draw);
//     }
// }

// /**
//  * Handle change event.
//  */
// typeSelect.onchange = function() {
//     map.removeInteraction(draw);
//     addInteraction();
// };

// addInteraction();
// //---------------------------------------------------} 




//document.getElementById('set-source').onclick = function() {
//    //layer.setSource(sourcemap);
//	setMap('研发测试机房结构平面图.bmp',789,834);
//};

//document.getElementById('set-source1').onclick = function() {
//    layer.setSource(sourcemap1);
//};

//document.getElementById('unset-source').onclick = function() {
//    layer.setSource(null);
//};
