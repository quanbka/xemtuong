system.controller("IndexController", IndexController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function IndexController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "IndexController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);


}
