(function () {
    'use strict';
    angular.module('app', ['qgrid'])
        .directive('qTextInput', function (qgridCfg) {
            return {
                scope: {
                    info: '=qTextInput',
                    edit: '='
                },
                require: '^qgridCell',
                templateUrl: qgridCfg.getTemplate('cells/textInput'),
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch('info.value', function(val){
                        ctrl.setSortValue(val);
                    });
                    scope.blur = function () {
                        ctrl.toogle(false);
                    };
                }
            };
        })
        .directive('qLazyReference', function (qgridCfg) {
            return {
                scope: {
                    info: '=qLazyReference',
                    edit: '='
                },
                require: '^qgridCell',
                templateUrl: qgridCfg.getTemplate('cells/lazyReference'),
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch('info.value.name', function(name){
                        ctrl.setSortValue(name);
                    });
                }
            };
        })
        .directive('qAction', function (qgridCfg) {
            return {
                scope: {
                    info: '=qAction'
                },
                templateUrl: qgridCfg.getTemplate('cells/action'),
                link: function (scope, element, attrs) {

                }
            };
        })
        .service('RestSrv', RestSrv)
        .controller('MainController', MainController);


    function MainController($scope, RestSrv) {
        var createItem = function (value, name) {
                return {
                    value: value
                    //templateUrl: name && '/dev/templates/qgrid.cell.custom.html'
                };
            },
            data = new Array(30).join(' 1').split(' ')
                .map(function (item, index) {
                    var id = index + 1;
                    return {
                        id: createItem(id),
                        name: createItem('User #' + id),
                        descriptions: createItem('Lorem ipsum dolor sit amet.', 'descriptions')
                    };
                });

        RestSrv.getTable({})
            .then(function (tbl) {
                $scope.qgridOptions = {
                    data: tbl.rows,
                    resizableCols: true,
                    cols: tbl.header
                };
            });

        /*RestSrv.get().then(function (data) {
         $scope.qgridOptions = {
         data: data,
         resizableCols: true,
         cols: [{
         field: 'id',
         displayName: '#',
         width: '30px'
         }, {
         field: 'name',
         displayName: 'Имя',
         width: '100px'
         }, {
         field: 'descriptions',
         displayName: 'Описание',
         width: '200px'
         }]
         };
         });
         */

        $scope.change = function () {
            var cols = $scope.qgridOptions.cols;
            cols.unshift(cols.pop());

        };
    }

    function RestSrv($http, $q) {
        var getHeader = function (options) {
                return $http.get('/rest/header').then(function (res) {
                    return res.data;
                });
            },
            getRows = function (options) {
                return $http.get('/rest/rows').then(function (res) {
                    return res.data;
                });
            };


        this.getTable = function (options) {
            return $q.all([getHeader(options), getRows(options)]).then(function (promises) {
                return {
                    header: promises[0],
                    rows: promises[1]
                };
            });
        };

        //this.get = function () {
        //    return $http.get('/rest/grid').then(function (res) {
        //        return res.data;
        //    });
        //};
    }
}());