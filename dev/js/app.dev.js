(function () {
    'use strict';
    angular.module('app', ['qgrid'])
        .controller('MainController', MainController);


    function MainController($scope, $http) {
        var data = new Array(30).join(' 1').split(' ')
            .map(function (item, index) {
                var id = index + 1;
                return {
                    id: id,
                    name: 'User #' + id,
                    descriptions: 'Lorem ipsum dolor sit amet.'
                };
            });

        $scope.qgridOptions = {
            data: data,
            resizableCols: false,
            cols: [{
                resizable: true,
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

        $scope.change = function () {
            var cols = $scope.qgridOptions.cols;
            cols.unshift(cols.pop());

        };
    }
}());