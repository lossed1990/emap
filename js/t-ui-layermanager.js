//=====图层管理界面类=====
var LayoutManagerWindow = {
    createNew: function() {
        var wnd = {};
        //=====私有成员变量=====
        //图表对象
        var $m_ui_modal = $('#map-dialog-layermanager');
        var $m_ui_table = $('#layer-table');

        wnd.init = function() {
            //初始化表格控件
            $m_ui_table.bootstrapTable({
                columns: [{
                    field: 'name',
                    title: '图层名称',
                    sortable: true,
                    searchable: true
                }, { //数据列
                    field: 'id',
                    title: '图层编号',
                    searchable: false,
                    visible: false
                }, {
                    field: 'fatherid',
                    title: '父图层编号',
                    searchable: false,
                    sortable: true,
                    visible: false
                }, {
                    field: 'img.imgid',
                    title: '底图编号',
                    searchable: false
                }, {
                    field: 'img.width',
                    title: '底图宽度',
                    searchable: false
                }, {
                    field: 'img.height',
                    title: '底图高度',
                    searchable: false
                }, {
                    title: '操作',
                    searchable: false,
                    formatter: operateFormatter,
                    events: operateEvents,
                    width: 60
                }],
                height: 460, //表高度，设置改值，可固定表头
                showToggle: true, //显示表格类型切换按钮
                showColumns: true, //显示表格列选择按钮
                search: true //显示检索输入框
            });

            //窗口大小改变时刷新窗口，以防列表不对齐
            $(window).resize(function() {
                $m_ui_table.bootstrapTable('resetView');
            });
        };

        wnd.show = function() {
            $m_ui_modal.modal('show');
        }

        wnd.onLayerDataChange = function(datamap) {
            var dataJson = [];
            var layerid = null;
            for (layerid in datamap) {
                dataJson.push(datamap[layerid]);
            }

            wnd.loadData(dataJson);
        }

        wnd.loadData = function(dataJson) {
            $m_ui_table.bootstrapTable('load', dataJson);

            //调整模态框位置
            $(".fixed-table-container").css("padding-bottom", "41px");
        }

        function operateFormatter(value, row, index) {
            //<a class="mod fa fa-pencil-square-o" >修改</a><a>&nbsp;&nbsp;</a>
            return '<a class="delete fa fa-trash-o" style="cursor: pointer">删除</a>';
        }

        window.operateEvents = {
            // 'click .mod': function(e, value, row, index) {
            //     //修改操作      
            //     alert("mod row:" + row + "index:" + index);
            // },
            'click .delete': function(e, value, row, index) {
                var textInfoStr = "确定要删除图层[" + row.name + "]吗?"
                swal({  
                        title: "提示",
                        text: textInfoStr,
                         type: "warning",
                          showCancelButton: true,
                         confirmButtonColor: "#DD6B55",
                          confirmButtonText: "确定删除",
                         cancelButtonText: "取消"
                    },
                    function(isConfirm) {  
                        if (isConfirm) {    
                            g_oServerApi.ajaxDeleteLayer(row.id);
                        }
                    });
            }
        }

        return wnd;
    }
};

//图层管理界面类全局对象
var g_oLayoutManagerWindow = LayoutManagerWindow.createNew();