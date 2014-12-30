(function () {
    'use strict';
    angular.module('qgrid')

        .directive('qgridColumnDrop', ['$parse', 'qgridDragDropBuffer', qgridColumnDrop])
        .directive('qgridColumnDrag', ['qgridDragDropBuffer', qgridColumnDrag])
        .directive('qgridDivider', [qgridDivider])
        .directive('qgridCellDispatcher', ['$compile', qgridCellDeispather])
        .directive('qgridCell', ['$compile', '$parse', '$timeout', 'qgridCfg', qgridCell])
        .directive('qgridFooter', ['qgridCfg', qgridFooter])
        .directive('qgridBody', ['qgridCfg', qgridBody])
        .directive('qgridHeader', ['qgridCfg', qgridHeader])
        .directive('qgrid', ['$parse', '$q', 'qgridCfg', 'qgridSrv', qgrid]);

    /**
     * Основная цель создать сервис в контроллере, который будет использоваться
     * внутреннимим директивами
     * */
    function qgrid($parse, $q, qgridCfg, qgridSrv) {
        return {
            scope: true,
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid'),
            link: function (scope, element, attrs) {
                var defer = $q.defer();
                scope.$watch(attrs.qgrid, function ($options) {
                    var _srv;
                    if (!$options) {
                        return;
                    }

                    scope.$options = $options;
                    scope.rows = $options.data;

                    _srv = qgridSrv.getService($options);

                    defer.resolve(_srv);
                    scope.stylePrefix = _srv.stylePrefix;
                });

                scope.$srv = defer.promise;
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
                qgrid.$srv()
                    .then(function ($srv) {
                        scope.headerRows = $srv.getHeader();
                        scope.cols = $srv.getColumns();
                        scope.calcStyle = function () {
                            $srv.createStyle();
                        };

                        // для drag/drop колонок
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
                    });
            }
        };
    }

    function qgridBody(qgridCfg) {
        return {
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid.body'),
            require: '^qgrid',
            link: function (scope, element, attrs, qgrid) {
            }
        };
    }

    function qgridFooter(qgridCfg) {
        return {
            replace: true,
            templateUrl: qgridCfg.getTemplate('qgrid.footer')
        };
    }

    function qgridCellDeispather($compile) {
        return {
            require: '^qgrid',
            scope: {
                info: '=qgridCellDispatcher',
                isEdit: '='
            },
            link: function (scope, element, attrs, qgrid) {
                qgrid.$srv().then(function(srv){
                    element.html($compile(srv.cellSrv.getTemplate(scope.info))(scope));
                });
            }
        };
    }

    function qgridCell($compile, $parse, $timeout, qgridCfg) {
        return {
            require: '^qgrid',
            controller: 'QGridCellController',
            scope: true,
            templateUrl: qgridCfg.getTemplate('qgrid.cell'),
            link: function (scope, element, attrs, qgrid) {
                qgrid.$srv().then(function ($srv) {
                    var cell = $parse(attrs.qgridCell)(scope);
                    //scope.cellInfo =
                    console.log($srv.cellSrv.getTemplate(cell.row, cell.col));
                    //$srv.getTemplate(cell.row, cell.col);
                    // element.html($compile($srv.getTemplate(cell.row, cell.col))(scope));
                    //
                    //scope.toggle = function () {
                    //    scope.isEdit = true;
                    //    setTimeout(function () {
                    //        element.find('input, textarea').focus();
                    //    }, 150);
                    //};
                    //
                    //scope.isEdit = false;
                    //scope.changeView = function (isEdit) {
                    //    $timeout(function () {
                    //        scope.isEdit = isEdit;
                    //        setTimeout(function () {
                    //            element.find('input, textarea').focus();
                    //        }, 25);
                    //    }, 100);
                    //
                    //};
                });

            }
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
                    pageX,
                    colWidth,
                    colMaxWidth,
                    colMinWidth;

                element.draggable({
                    axis: 'x',
                    start: function (event, ui) {
                        dividerWidth = element.width();
                        pageX = event.pageX;
                        colWidth = parseInt(col.width);
                        colMaxWidth = parseInt(col.maxWidth);
                        colMinWidth = parseInt(col.minWidth);

                        console.log(colMaxWidth);
                    },
                    drag: function (event, ui) {
                        var width = colWidth + dividerWidth + event.pageX - pageX,
                            prevent = false;
                        event.stopPropagation();


                        if (colMinWidth && width < colMinWidth) {
                            width = colMinWidth;
                        }

                        if (colMaxWidth && width > colMaxWidth) {
                            width = colMaxWidth;
                        }

                        col.width = width + 'px';
                        scope.onDrag();
                        setTimeout(function () {
                            element.attr('style', '');
                        }, 25);

                        if (prevent) {
                            return false
                        }
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