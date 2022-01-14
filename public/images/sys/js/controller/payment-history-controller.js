system.controller("PaymentHistoryController", PaymentHistoryController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function PaymentHistoryController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "PaymentHistoryController";
    $scope.pageId = 0;
    $scope.filter = {
        key: ""
    };
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function(){
        $scope.find();
    }

    $scope.find = function(){
        $('#searchParamButton').button('loading');
        var param = {
            api_token: api_token,
            page_id: $scope.pageId + 1,

        };
        if ($scope.filter.search_user) {
            param.search_user = $scope.filter.search_user;
        }
        if ($scope.filter.checkout_time_from) {
            param.checkout_time_from = $scope.filter.checkout_time_from;
        }
        if ($scope.filter.checkout_time_to) {
            param.checkout_time_to = $scope.filter.checkout_time_to;
        }
        url = api_domain + "/api/payment/find-histories";
        $http({
            url: url,
            method: "GET",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    $scope.payments = response.data.data;
                    $scope.pageId = response.data.paginator.off_set;
                    $scope.pagesCount = response.data.paginator.page_count;
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
                $('#searchParamButton').button('reset');
            }
        );
    };

    $scope.reset = function () {
        $scope.filter = {
            key: ''
        }
        $scope.find();
    };

    $scope.showPayment = function (id) {
        var param = {
            api_token: api_token,
            payment_id: id

        };
        url = api_domain + "/api/payment/get-list-order-by-payment-id";
        $http({
            url: url,
            method: "POST",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    $scope.orders = response.data.data;
                    $('#createPage').modal('show');
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
            }
        );

    };

    this.initialize();


}
