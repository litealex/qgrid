(function () {
    'use strict';
    angular.module('qgrid')
        .value('qgridDragDropBuffer',{
            item: null
        })
        .service('qgridSrv', ['qgridCfg', function (qgridCfg) {
            var idx = 1;
            this.getService = function (options) {
                return new QGridSrv(options, qgridCfg, 'tbl' + idx + '_');
            };
        }]);

    function QGridSrv(options, defaultOptions, stylePrefix) {
        // стили для ширины колонок
        var style = angular.element('<style>');
        angular.element('head').append(style);

        this.style = style;
        this.stylePrefix = stylePrefix;

        this._defaultOptions = defaultOptions;
        this.options = options;
    }
    QGridSrv.prototype.getColumns = function () {
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
        return cols;
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
        }
    };
    QGridSrv.prototype.createStyle = function () {
        // создается таблица стилей и одновременно записывается
        // название класса в колонку
        var stylePrefix = this.stylePrefix,
            cols = this.cols || this.getColumns(),
            col,
            len = cols.length,
            styles = [];

        for (var i = 0; i < len; i++) {
            col = cols[i];
            col.cssClass = stylePrefix + 'col_' + col.field;
            styles.push('.' + col.cssClass + '{');
            styles.push('width:' + col.width + ';');
            styles.push('}');
        }

        this.style.text(styles.join(' '));
    };


}());