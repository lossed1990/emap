//=====图层信息显示区相关界面事件处理=====
/** 关闭按钮 */
$("#map-info-close").click(function() {
    $("#map-info").css("visibility", "hidden");
    $("#panel-map-info").css("visibility", "hidden");
    $("#panel-node-list").css("visibility", "hidden");
});

/** 信息区移动 */
$("#map-info").draggable({ containment: "body", scroll: false, cursor: "move" });

/** 切换信息区内容 */
$("#index-map-info").click(function() {
    $("#index-map-info").removeClass("icon-circle-blank");
    $("#index-map-info").addClass("icon-circle");
    $("#index-node-list").removeClass("icon-circle");
    $("#index-node-list").addClass("icon-circle-blank");

    $("#panel-map-info").css("visibility", "visible");
    $("#panel-node-list").css("visibility", "hidden");

    $("#map-info-title").html("&nbsp;⏩&nbsp;图层信息");
});

$("#index-node-list").click(function() {
    $("#index-node-list").removeClass("icon-circle-blank");
    $("#index-node-list").addClass("icon-circle");
    $("#index-map-info").removeClass("icon-circle");
    $("#index-map-info").addClass("icon-circle-blank");

    $("#panel-map-info").css("visibility", "hidden");
    $("#panel-node-list").css("visibility", "visible");

    $("#map-info-title").html("&nbsp;⏩&nbsp;节点列表");
});


//=====检索区相关界面事件处理=====


/** 检索区移动 */
$("#map-search").draggable({ containment: "body", scroll: false, cursor: "move" });

$("#map-search-input").click(function() {
    $("#map-search").css("height", "400px");
    $(".search-panel").css("visibility", "visible");
});

$("#btn-search").click(function() {
    $("#map-search").css("height", "400px");
    $(".search-panel").css("visibility", "visible");
});


// $("#map-search").focusout(function() {

//     $("#map-search").mousedown(function(e) {

//         $(".search-panel").css("visibility", "hidden");
//     });

// });
var bIn = false;

$("#map-search").mouseleave(function() {
    bIn = false;
});

$("#map-search").mouseenter(function() {
    bIn = true;
});

$("body").mousedown(function() {
    if (!bIn) {
        $("#map-search").css("height", "45px");
        $(".search-panel").css("visibility", "hidden");
    }
});



//=====工具栏区相关界面事件处理=====
var items = document.querySelectorAll('.menuItem');

for (var i = 0, l = items.length; i < l; i++) {
    items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";

    items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
}

document.querySelector('.center').onclick = function(e) {
    e.preventDefault();
    document.querySelector('.circle').classList.toggle('open');
}

/** 工具栏移动 */
$(".circle").draggable({ containment: "body", scroll: false, cursor: "move" });