var map;
var curmarker;
var straa;
//var MarkerList = new Array();
//var myCenter = new google.maps.LatLng(31.22542672706103, 121.46753272070305); //上海
// function CoordMapType() {}
// CoordMapType.prototype.tileSize = new google.maps.Size(256, 256);
// CoordMapType.prototype.maxZoom = 16;
// CoordMapType.prototype.minZoom = 6;

// CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
//     var div = ownerDocument.createElement('div');
//     div.innerHTML = '<img name="" src="./tiles/' + zoom + '/' + coord.x + '/' + coord.y + '.png"/>';

//     div.style.width = this.tileSize.width + 'px';
//     div.style.height = this.tileSize.height + 'px';
//     div.style.fontSize = '10';
//     div.style.borderStyle = 'solid';
//     div.style.borderWidth = '0px';
//     div.style.borderColor = '#AAAAAA';
//     return div;
// };

// CoordMapType.prototype.name = "Tile #s";
// CoordMapType.prototype.alt = "Tile Coordinate Map Type";

//var coordinateMapType = new CoordMapType();

/**
 * @breif 初始化谷歌地图
 */
function initGoogleMap() {

    map = new mapboxgl.Map({
        container: 'map_google', // container id
        style: 'style.json', //stylesheet location
        center: [121.4, 31.2], // starting position
        zoom: 12 // starting zoom
    });



    // var mapOptions = {
    //     zoom: 10,
    //     center: myCenter,
    //     mapTypeId: "coordinate",
    //     mapTypeControl: false,
    //     disableDoubleClickZoom: true
    // };
    // map = new google.maps.Map(document.getElementById("map_google"), mapOptions);
    // map.mapTypes.set('coordinate', coordinateMapType);

    // google.maps.event.addListener(map, 'dblclick', function(event) {
    //     document.getElementById('longitude').value = event.latLng.lng();
    //     document.getElementById('latitude').value = event.latLng.lat();
    //     window.external.MapClick();

    //     //alert(event.latLng.lng());
    // });

    // //划线
    // //{---------------------------------------------
    // var flightPlanCoordinates = [
    //     new google.maps.LatLng(31.21542670706103, 121.41753272070305),
    //     new google.maps.LatLng(31.22542671706103, 121.46753272170305),
    //     new google.maps.LatLng(31.23542672706103, 121.48753272270305),
    //     new google.maps.LatLng(31.24542673706103, 121.56753272370305)
    // ];

    // var flightPath = new google.maps.Polyline({
    //     path: flightPlanCoordinates,            //路径点坐标
    //     strokeColor: "#FF0000",                 //颜色 
    //     strokeOpacity: 0.5,                     //透明度
    //     strokeWeight: 4                         //宽度
    // });

    // flightPath.setMap(map);
    // //----------------------------------------------}

    // //划圆形区域 http://blog.csdn.net/hgy2011/article/details/7742091
    // //{---------------------------------------------
    // var populationOptions = {
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    //     map: map,
    //     center: myCenter,
    //     radius: 100
    // };

    // var cityCircle = new google.maps.Circle(populationOptions);
    // //----------------------------------------------}

    // //增加遮盖图片
    // //{---------------------------------------------
    // var imageBounds = new google.maps.LatLngBounds(
    //     new google.maps.LatLng(31.21542670706103, 121.41753272070305),
    //     new google.maps.LatLng(31.22542671706103, 121.46753272170305)
    // );

    // var oldmap = new google.maps.GroundOverlay("1.jpg", imageBounds);
    // oldmap.setMap(map);
    // //----------------------------------------------}

    // var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
    // panoramioLayer.setMap(map);

    // google.maps.event.addListener(panoramioLayer, 'click', function(event) {
    //     var photoDiv = document.getElementById('photoPanel');
    //     var attribution = document.createTextNode(event.featureDetails.title + ": " + event.featureDetails.author);
    //     var br = document.createElement("br");
    //     var link = document.createElement("a");
    //     link.setAttribute("href", event.featureDetails.url);
    //     link.appendChild(attribution);
    //     photoDiv.appendChild(br);
    //     photoDiv.appendChild(link);
    // });
}

function SetCentor() {
    var pos = new google.maps.LatLng(document.getElementById('latitude').value, document.getElementById('longitude').value);
    map.setCenter(pos);
}

function ChangeMapSize() {
    var divMap = document.getElementById('map_canvas');
    divMap.style.width = document.getElementById('mapwidth').value + "px";
    divMap.style.height = document.getElementById('mapheight').value + "px";
}

function AddMark() {
    var image = 'img/24.png';
    var myLatLng = new google.maps.LatLng(document.getElementById('latitude').value, document.getElementById('longitude').value);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        title: document.getElementById('markname').value
    });

    if (document.getElementById('bdelete').value !== '可删除') {
        beachMarker.setDraggable(false);

        straa = '<div id="content">' +
            '<div>' +
            '</div>' +
            '<div id="bodyContent">' +
            '' + document.getElementById('info').value +
            '<br/><a id="setPotA" href="#" onclick="fixedPosition()">定位</a>'
        '</div>';
    } else {
        beachMarker.setDraggable(true);

        straa = '<div id="content">' +
            '<div>' +
            '</div>' +
            '<div id="bodyContent">' +
            '' + document.getElementById('info').value +
            '<br/><a id="setPotA" href="#" onclick="fixedPosition()">定位</a><a id="DelMarker" href="#" onclick="DelMarker()">删除</a>'
        '</div>';
    }

    var infowin = new google.maps.InfoWindow({
        //content: contentString  onclick="fixedPosition()"
    });

    infowin.setContent(straa);

    google.maps.event.addListener(beachMarker, 'click', function() {
        curmarker = beachMarker;
        infowin.open(map, beachMarker);
    });

    google.maps.event.addListener(beachMarker, 'dblclick', function() {
        document.getElementById('markname').value = beachMarker.getTitle();
        window.external.MarkerClick();
    });

    google.maps.event.addListener(beachMarker, 'dragend', function(event) {
        document.getElementById('markname').value = beachMarker.getTitle();
        document.getElementById('longitude').value = event.latLng.lng();
        document.getElementById('latitude').value = event.latLng.lat();
        window.external.ChangeLonLat();

        alert(event.latLng.lng());
    });

    MarkerList.push(beachMarker);
}

function ChangeMarkerFocus() {
    var identifier = document.getElementById('markname').value;
    for (var i = 0; i < MarkerList.length; ++i) {
        if (MarkerList[i].getTitle() == identifier) {
            MarkerList[i].setIcon("img/24.png");
            break;
        }
    }
}

function ChangeMarkerNor() {
    var identifier = document.getElementById('markname').value;
    for (var i = 0; i < MarkerList.length; ++i) {
        if (MarkerList[i].getTitle() == identifier) {
            MarkerList[i].setIcon("img/24.gif");
            break;
        }
    }
}

function DeleteMarker() {
    var identifier = document.getElementById('markname').value;
    for (var i = 0; i < MarkerList.length; ++i) {
        if (MarkerList[i].getTitle() == identifier) {
            MarkerList[i].setMap(null);
            break;
        }
    }
}

function fixedPosition() {
    var position = curmarker.getPosition()
    map.setZoom(16);
    map.setCenter(position);
}

function DelMarker() {
    document.getElementById('markname').value = curmarker.getTitle();
    window.external.DeleteMarker();
    curmarker.setMap(null);
}