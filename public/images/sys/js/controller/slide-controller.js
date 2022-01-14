system.controller("SlideController", SlideController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function SlideController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "SlideController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);

    this.init = function () {
        this.getSlideConfig();
    }

    this.getSlideConfig = function () {
        $http({
            method : "GET",
            url : "/api/config",
            params : {
                api_token : api_token,
                key : "slide",
            }
        }).then(function mysuccessful(response) {
            console.log(response);
        }, function myError(response) {

        });
    }

    this.init();
}
