//=====图层信息显示区相关界面事件处理=====
/**信息区移动事件*/
$("#map-info").draggable({ containment: "body", scroll: false, cursor: "move" });

/**关闭按钮点击事件*/
$("#map-info-close").click(function() {
    $("#map-info").css("visibility", "hidden");
    $("#map-info-base").css("visibility", "hidden");
    $("#map-info-node").css("visibility", "hidden");
});

/**tab切换按钮点击事件*/
$("#map-info-indicators-base").click(function() {
    //更换icon
    $("#map-info-indicators-base").removeClass("icon-circle-blank");
    $("#map-info-indicators-base").addClass("icon-circle");
    $("#map-info-indicators-node").removeClass("icon-circle");
    $("#map-info-indicators-node").addClass("icon-circle-blank");
    //隐藏panel
    $("#map-info-base").css("visibility", "visible");
    $("#map-info-node").css("visibility", "hidden");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;图层信息");
});
$("#map-info-indicators-node").click(function() {
    //更换icon
    $("#map-info-indicators-node").removeClass("icon-circle-blank");
    $("#map-info-indicators-node").addClass("icon-circle");
    $("#map-info-indicators-base").removeClass("icon-circle");
    $("#map-info-indicators-base").addClass("icon-circle-blank");
    //隐藏panel
    $("#map-info-base").css("visibility", "hidden");
    $("#map-info-node").css("visibility", "visible");
    //修改title
    $("#map-info-title").html("&nbsp;⏩&nbsp;节点列表");
});


//=====检索区相关界面事件处理=====
/**检索区移动事件*/
$("#map-search").draggable({ containment: "body", scroll: false, cursor: "move" });
/**检索输入框点击事件*/
$("#map-search-input").click(function() {
    $("#map-search").css("height", "400px");
    $("#map-search-panel").css("visibility", "visible");
});
/**检索按钮点击事件*/
$("#map-search-btn").click(function() {
    $("#map-search").css("height", "400px");
    $("#map-search-panel").css("visibility", "visible");
});
/**判断是否需要隐藏检索区域*/
(function() {
    var bIn = false;
    $("#map-search").mouseleave(function() { bIn = false; });
    $("#map-search").mouseenter(function() { bIn = true; });
    $("body").mousedown(function() {
        if (!bIn) {
            $("#map-search").css("height", "45px");
            $("#map-search-panel").css("visibility", "hidden");
        }
    });
}())


//=====工具栏区相关界面事件处理=====
/**初始化工具栏菜单*/
(function() {
    var items = document.querySelectorAll('.map-tools-menuItem');
    for (var i = 0, l = items.length; i < l; i++) {
        items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
        items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
    }

    /**工具栏菜单按钮点击事件*/
    document.querySelector('.map-tools-center').onclick = function(e) {
        e.preventDefault();
        document.querySelector('.map-tools').classList.toggle('map-tools-open');
    }

    /**工具栏移动*/
    $(".map-tools").draggable({ containment: "body", scroll: false, cursor: "move" });
}())