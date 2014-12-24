(function () {
    'use strict';
    angular.module('qgrid')
        /**
         *
         * */

        .constant('qgridCfg', {
            cols: {
                width: '100px'
            },
            rnd: +new Date(),
            templatesPrefix: '/src/templates/',
            getTemplate: function (name) {
                return this.templatesPrefix + name + '.html?_=' + this.rnd;
            }
        });
}());