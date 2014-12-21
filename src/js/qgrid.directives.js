(function () {
    'use strict';
    angular.module('qgrid')
        .directive('qgridColumnDrop', ['$parse', 'qgridDragDropBuffer', qgridColumnDrop])
        .directive('qgridColumnDrag', ['qgridDragDropBuffer', qgridColumnDrag])
        .directive('qgridDivider', [qgridDivider])
        .directive('qgridFooter', ['qgridCfg', qgridFooter])
        .directive('qgridBody', ['qgridCfg', qgridBody])
        .directive('qgridHeader', ['qgridCfg', qgridHeader])
        .directive('qgrid', ['$parse', 'qgridCfg', 'qgridSrv', qgrid]);

    function qgrid($parse, qgridCfg, qgridSrv) {
        return {
            scope: true,
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid'),
            link: function (scope, element, attrs) {
                scope.$options = $parse(attrs.qgrid)(scope);
                scope.rows = scope.$options.data;
                var $srv = qgridSrv.getService(scope.$options);
                scope.stylePrefix = $srv.stylePrefix;

                scope.getService = function () {
                    return $srv;
                };
            },
            controller: 'QGridController'
        };
    }

    function qgridHeader(qgridCfg) {
        return {
            require: '^qgrid',
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid.header'),
            link: function (scope, element, attrs, qgrid) {
                var $srv = qgrid.$srv();
                scope.cols = $srv.getColumns();
                scope.calcStyle = function () {
                    $srv.createStyle();
                };
                scope.changeCols = function (col, newCol, $isAfter, $index) {
                    scope.$apply(function () {
                        var cols = scope.cols,
                            i1 = getIndex(cols, col),
                            i2 = getIndex(cols, newCol);
                        cols[i1] = newCol;
                        cols[i2] = col;
                    });
                };
                $srv.createStyle();
            }
        };
    }

    function qgridBody(qgridCfg) {
        return {
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid.body'),
            require: '^qgrid',
            link: function (scope, element, attrs, qgrid) {
                var $srv = qgrid.$srv();
            }
        };
    }

    function qgridFooter(qgridCfg) {
        return {
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid.footer')
        };
    }

    function qgridDivider() {
        return {
            scope: {
                col: '=qgridDivider',
                onDrag: '&qgridDividerDrag'
            },
            link: function (scope, element, attrs) {
                var col = scope.col,
                    dividerWidth,
                    pageX, colWidth;

                element.draggable({
                    axis: 'x',
                    start: function (event, ui) {
                        dividerWidth = element.width();
                        pageX = event.pageX;
                        colWidth = parseInt(col.width);
                    },
                    drag: function (event, ui) {
                        event.stopPropagation();
                        col.width = colWidth + dividerWidth + event.pageX - pageX + 'px';
                        scope.onDrag();
                        setTimeout(function(){
                            element.attr('style', '');
                        },25);

                    }
                });
            }
        };
    }

    function qgridColumnDrag(qgridDragDropBuffer) {
        return {
            scope: {
                col: '=qgridColumnDrag'
            },
            link: function (scope, element, attrs) {
                element.draggable({
                    helper: 'clone',
                    start: function () {
                        qgridDragDropBuffer.item = scope.col;
                    }
                });
            }
        };
    }

    function qgridColumnDrop($parse, qgridDragDropBuffer) {
        return {
            controller: 'QGridColumnDrop',
            link: function (scope, element, attrs) {
                var onDrop = $parse(attrs.qgridColumnDrop),
                    _scope = scope.getDropScope();

                scope.getDropScope = function () {
                    return _scope;
                };

                element.droppable({
                    drop: function (event, ui) {
                        _scope.$newCol = qgridDragDropBuffer.item;
                        if (_scope.$newCol) {
                            onDrop(_scope);
                            qgridDragDropBuffer.item = null;
                        }
                    }
                });
            }
        };
    }


    function getIndex(array, item) {
        var len = array.length;
        while (len--) {
            if (array[len] == item) return len;
        }
        return -1;
    }
}());