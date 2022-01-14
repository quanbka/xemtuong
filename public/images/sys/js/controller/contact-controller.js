system.controller("ContactController", ContactController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function ContactController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "ContactController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function(){
        $scope.find();
    }

    $scope.filter = {
        page: 0
    };

    $scope.resetFilter = function(){
        $scope.filter = {
            name: "",
            email: "",
            page: 0
        }
    }

    $scope.find = function(){
        url = api_domain + "/api/contact";
        $('#searchCategoryButton').button('loading');
        $scope.buildParam();
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
                name: $scope.params.name,
                email: $scope.params.email,
                page_id : $scope.params.page + 1,
                page_size : 20,
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
            function(response){
                $scope.contacts = response.data.data;
                $scope.pagesCount = response.data.paginator.page_count;
                $('#searchCategoryButton').button('reset');
            }
        );
    }

    $scope.buildParam = function(){
        $scope.params = angular.copy($scope.filter);
        for(var key in $scope.params){
            if($scope.params[key] === ''){
                delete ($scope.params[key]);
            }
        }
    }

    $scope.reset = function(){
        $scope.resetFilter();
        $scope.find();
    }

    this.initialize();

}
