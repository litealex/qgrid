(function () {
    'use strict';
    angular.module('qgrid')
        .controller('QGridCellController', ['$scope', QGridCellController])
        .controller('QGridColumnDrop', ['$scope', QGridColumnDrop])
        .controller('QGridController', ['$scope', 'qgridSrv', QGridController]);

    function QGridController($scope) {
        return {
            $srv: function () {
                return $scope.$srv;
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

    function QGridCellController($scope) {
        return {
            toogle: function (isEdit) {
                $scope.isEdit = isEdit;
            },
            setSortValue: function (val) {
                $scope.cellInfo.sortValue = val;
            }

        };
    }

}());