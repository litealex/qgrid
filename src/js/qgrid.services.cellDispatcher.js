/**
 * Created by ZakharovAA on 24.12.2014.
 */
(function () {
    'use strict';
    angular.module('qgrid')
        .service('cellSrv', ['$parse', cellSrv]);


    function cellSrv($parse) {

        this.getTemplate = function (cells, col) {

            var i, len = cells.length;
            for (i = 0; i < len; i++) {
                if (cells[i].colId === col.node.colId) {
                    return this.getTemplatePart(cells[i].content);
                }
            }
        };

        this.getTemplatePart = function (content) {
            var len, i, ci, type, res = [];

            //var type = $parse('fieldDescription.type')(ci);
            for (i = 0, len = content.length; i < len; i++) {
                ci = content[i];
                type = $parse('fieldDescription.type')(ci);

                if (type !== undefined) {
                    res.push(templates[type]());
                } else {
                    res.push(templates['action']());
                }
            }
            return res.join('');
        };

        var templates = {
            'textInput': function (ci) {
                return '<div q-text-input="info" edit="isEdit"></div>';
            },
            'lazyReference': function (ci) {
                return '<div q-lazy-Reference="info" edit="isEdit"></div>';
            },
            'action': function (ci) {
                return '<div q-action="info"></div>'
            }
        }
    }
}());