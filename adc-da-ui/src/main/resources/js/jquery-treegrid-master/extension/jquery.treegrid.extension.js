(function ($) {
    "use strict";

    $.fn.treegridData = function (options, param) {
        //如果是调用方法
        if (typeof options == 'string') {
            return $.fn.treegridData.methods[options](this, param);
        }

        //如果是初始化组件
        options = $.extend({}, $.fn.treegridData.defaults, options || {});
        var target = $(this);
        // //debugger;
        //得到根节点
        target.getRootNodes = function (data) {
            var result = [];
            $.each(data, function (index, item) {

                if (item[options.parentColumn]== 0) {
                    result.push(item);
                }
            });
            return result;
        };
        var j = 0;
        //递归获取子节点并且设置子节点
        target.getChildNodes = function (data, parentNode, parentIndex, tbody) {
            //debugger;
            $.each(data, function (i, item) {
                if (item[options.parentColumn] == parentNode[options.id]) {
                    var tr = $('<tr></tr>');
                    var nowParentIndex = (parentIndex + j + 1);
                    j=nowParentIndex;
                    tr.addClass('treegrid-' + nowParentIndex);
                    tr.addClass('treegrid-parent-' + parentIndex);
                    tr.append($('<td></td>'));
                    var id = item['id'];
                    //debugger;
                    $.each(options.columns, function (index, column) {
                        var td = $('<td></td>');

                        td.text((item[column.field]==null)?'':item[column.field]);

                        if(column.field=='operate'){

                            td = $("<td><div class=\"tabletools\"><a  href=\"javascript:;\"  id=\""+id+"\"   onclick=\"doEdit(this)\"><i class=\"icon-pencil\"></i>编辑</a>&nbsp&nbsp&nbsp"+
                                "<a  href=\"javascript:;\" href=\"javascript:;\" name=\""+id+"\"  onclick=\"doDelete(this)\"><i class=\"icon-trash\" ></i>删除</a></div></td>");
                        }
                        tr.append(td);
                    });
                    tbody.append(tr);
                    //debugger;
                    target.getChildNodes(data, item, nowParentIndex, tbody)

                }
            });
        };
        target.addClass('table');
        if (options.striped) {
            target.addClass('table-striped');
        }
        if (options.bordered) {
            target.addClass('table-bordered');
        }
        if (options.url) {
            $.ajax({
                type: options.type,
                url: options.url,
                data: options.ajaxParams,
                dataType: "JSON",
                success: function (data, textStatus, jqXHR) {
                    //   //debugger;
                    //构造表头
                    var thr = $('<tr></tr>');
                    thr.append($('<th style="padding:10px;">序号</th>'));
                    $.each(options.columns, function (i, item) {
                        var th = $('<th style="padding:10px;"></th>');
                        th.text(item.title);
                        thr.append(th);
                    });
                    var thead = $('<thead></thead>');
                    thead.append(thr);
                    target.append(thead);

                    //构造表体
                    var tbody = $('<tbody></tbody>');
                    var rootNode = target.getRootNodes(data.data);
                    $.each(rootNode, function (i, item) {
                        var tr = $('<tr></tr>');
                        tr.addClass('treegrid-' + (j+i));
                        tr.append($('<td>'+ parseInt(i+1)+'</td>'));//序号列
                        var id = item['id'];
                        $.each(options.columns, function (index, column) {
                            var td;
                            if(column.field=='operate'){
                                //console.log(id);
                                td = $("<td><div class=\"tabletools\"><a  href=\"javascript:;\"  id=\""+id+"\"   onclick=\"doEdit(this)\"><i class=\"icon-pencil\"></i>编辑</a>&nbsp&nbsp&nbsp"+
                                    "<a  href=\"javascript:;\" href=\"javascript:;\" name=\""+id+"\"  onclick=\"doDelete(this)\"><i class=\"icon-trash\" ></i>删除</a></div></td>");
                            }
                            else{
                                td = $('<td></td>');
                                td.text((item[column.field]==null)?'':item[column.field]);
                            }
                            tr.append(td);
                        });
                        tbody.append(tr);
                        target.getChildNodes(data.data, item, (j + i), tbody);
                    });
                    target.append(tbody);
                    target.treegrid({
                        expanderExpandedClass: options.expanderExpandedClass,
                        expanderCollapsedClass: options.expanderCollapsedClass
                    });
                    if (!options.expandAll) {
                        target.treegrid('collapseAll');
                    }
                }
            });
        }
        else {
            //也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....有兴趣可以自己实现，思路和上述类似
        }
        return target;
    };

    $.fn.treegridData.methods = {
        getAllNodes: function (target, data) {
            return target.treegrid('getAllNodes');
        },
        //组件的其他方法也可以进行类似封装........
    };

    $.fn.treegridData.defaults = {
        id: 'id',
        parentColumn: 'parentId',
        data: [],    //构造table的数据集合
        type: "GET", //请求数据的ajax类型
        url: null,   //请求数据的ajax的url
        ajaxParams: {}, //请求数据的ajax的data属性
        //  expandColumn: 'name',//在哪一列上面显示展开按钮
        expandAll: false,  //是否全部展开
        striped: false,   //是否各行渐变色
        bordered: false,  //是否显示边框
        columns: [],
        expanderExpandedClass: 'treegrid-expander-expanded',//展开的按钮的图标
        expanderCollapsedClass: 'treegrid-expander-collapsed'//缩起的按钮的图标

    };
})(jQuery);