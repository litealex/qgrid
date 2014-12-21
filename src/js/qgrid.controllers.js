(function () {
    'use strict';
    angular.module('qgrid')
        .controller('QGridColumnDrop', ['$scope', QGridColumnDrop])
        .controller('QGridController', ['$scope', 'qgridSrv', QGridController]);

    function QGridController($scope, qgridSrv) {
        return {
            $srv: function () {
                return $scope.getService();
            }
        };
    }

    function QGridColumnDrop($scope) {
        var _scope = $scope.$new();
        $scope.getDropScope = function () {
            return _scope;
        };
        return {
            getDropScope: $scope.getDropScope
        };
    }

}());