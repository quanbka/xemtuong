system.controller("HeaderController", HeaderController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function HeaderController($scope, $http, $rootScope, $timeout, Upload, $interval) {
    $scope.controllerName = "HeaderController";


    $interval(function(){
        $scope.time = moment().format("HH:mm:ss");
        $scope.day = moment().format("DD/MM/YYYY");
    }, 1000);


}
