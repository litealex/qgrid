/**
 * Created by ZakharovAA on 24.12.2014.
 */
(function () {
    'use strict';
    angular.module('qgrid')
        .service('cellSrv', ['$parse', cellSrv]);


    function cellSrv($parse) {
        this.getTemplate = function (ci) {

            var type = $parse('fieldDescription.type')(ci);
            if (type !== undefined) {
                return templates[type]();
            } else {
                return templates['action']();
            }
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