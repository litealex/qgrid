(function () {
    'use strict';
    angular.module('qgrid')
        .value('qgridDragDropBuffer', {
            item: null
        })


        .service('qgridSrv', ['$http', '$q', '$templateCache', 'qgridCfg',
            function ($http, $q, $templateCache, qgridCfg) {
                var idx = 1;
                this.getService = function (options) {
                    return new QGridSrv({
                        options: options,
                        defaultOptions: qgridCfg,
                        stylePrefix: 'tbl' + idx + '_',
                        $http: $http,
                        $q: $q,
                        $templateCache: $templateCache
                    });
                };
            }]);

    //options, defaultOptions, stylePrefix, $http
    function QGridSrv(opts) {
        // стили для ширины колонок
        var style = angular.element('<style>');
        angular.element('head').append(style);
        this.fieldId = 1;
        this.cssClasses = {};


        // устанавливается в headerFromTree
        this.realCols = null;

        this.style = style;
        this.stylePrefix = opts.stylePrefix;

        this._defaultOptions = opts.defaultOptions; // todo rename defaultOptions
        this.options = opts.options; // todo rename gridOptions

        this.$http = opts.$http;
        this.$q = opts.$q;
        this.$templateCache = opts.$templateCache;
    }

    QGridSrv.prototype.getColumns = function () {
        this.checkCols(this.realCols);
        return this.realCols;
        /*
         var options = this.options,
         cols = options.cols,
         row, prop;




         if (!cols) {
         cols = [];
         row = this.options.data && this.options.data[0];
         if (row) {
         for (prop in row) {
         if (!row.hasOwnProperty(prop)) {
         continue;
         }
         cols.push({
         field: prop,
         displayName: prop,
         resizable: options.resizableCols
         });
         }
         }
         }
         this.checkCols(cols);
         this.cols = cols;
         return cols;*/
    };
    QGridSrv.prototype.checkCols = function (cols) {
        var len = cols.length,
            options = this.options,
            defaultWidth = this._defaultOptions.cols.width,
            col;
        for (; len--;) {
            col = cols[len];
            // ширина по умолчанию
            col.width = col.width || defaultWidth;
            // возможность изменения ширины колонк
            if (col.resizable === undefined) {
                col.resizable = options.resizableCols;
            }
            //col.html = this.getTemplate(col.template, col.templateUrl);
        }
    };
    QGridSrv.prototype.createStyle = function () {
        // создается таблица стилей и одновременно записывается
        // название класса в колонку
        var stylePrefix = this.stylePrefix,
            cols = this.realCols || this.getColumns(),
            col,
            len = cols.length,
            styles = [];

        for (var i = 0; i < len; i++) {
            col = cols[i];
            col.cssClass = stylePrefix + this.getFieldCssClass(col.node.colId);
            styles.push('.' + col.cssClass + '{');
            styles.push('width:' + col.width + ';');
            styles.push('}');
        }

        this.style.text(styles.join(' '));
    };

    QGridSrv.prototype.getTemplate = function (template, templateUrl) {
        var defer = this.$q.defer();
        if (template) {
            defer.resolve(template);
        } else if (templateUrl) {
            return this.$http({
                url: templateUrl,
                method: 'GET',
                cache: this.$templateCache
            }).then(function (resp) {
                return resp.data;
            });
        } else {
            defer.reject();
        }
        return defer.promise;
    };

    QGridSrv.prototype.headerFromTree = function (cols) {
        var rowsCount = getRowsCount(cols) + 1,
            rows = [],
            row,
            rowIndex,
            cellIndex,
            cell;
        for (rowIndex = 1; rowIndex < rowsCount; rowIndex++) {
            row = getCellByLevel(cols, rowIndex);
            for (cellIndex = 0; cellIndex < row.length; cellIndex++) {
                cell = row[cellIndex];
                cell.colspan = getDeepestChildrenCount(cell);
                cell.rowspan = hasChild(cell) ? 1 : rowsCount - rowIndex;
            }
            if (rowIndex === (rowsCount - 1)) {
                this.realCols = row;
            }
            rows.push(row);
        }
        return rows;
    };
    QGridSrv.prototype.getHeader = function () {
        return this.headerFromTree(this.options.cols);
    };

    QGridSrv.prototype.getFieldCssClass = function (colId) {
        var cssClasses = this.cssClasses;
        if (!cssClasses[colId]) {
            cssClasses[colId] = '__q__col__' + (this.fieldId++);
        }
        return cssClasses[colId];
    };

    QGridSrv.prototype.getTemplateInfo = function (cells, col) {
        var i, len = cells.length;
        for (i = 0; i < len; i++) {
            if (cells[i].colId === col.node.colId) {
                return cells[i];
            }
        }
    };

// helper function
    // rowspan
    function getRowsCount(cols) {
        var deeps = [0],
            col;
        for (var i = 0; i < cols.length; i++) {
            col = cols[i];
            if (col.children && col.children.length) {
                deeps.push(getRowsCount(col.children));
            }
        }


        return 1 + Math.max.apply(Math, deeps);
    }

    // th
    function getCellByLevel(cols, level, currentLevel) {
        var cells = [], i, col;
        currentLevel = currentLevel || 1;
        if (currentLevel === level) {
            return cols;
        }
        if (currentLevel < level) {
            for (i = 0; i < cols.length; i++) {
                col = cols[i];
                if (col.children) {
                    cells = cells.concat(getCellByLevel(col.children, level, currentLevel + 1))
                }
            }
            return cells;
        }
        return [];
    }

    //colspan
    function getDeepestChildrenCount(col) {
        var childern = col.children || [],
            sum = 0;

        if (!childern.length) {
            return 1;
        }
        else {
            for (var i = 0; i < childern.length; i++) {
                sum += getDeepestChildrenCount(childern[i]);
            }
            return sum;
        }
    }

    //
    function hasChild(cell) {
        return !!(cell.children && cell.children.length);
    }

}());