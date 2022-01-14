system.controller("PaymentCheckoutController", PaymentCheckoutController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function PaymentCheckoutController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "PaymentCheckoutController";
    $scope.pageId = 0;
    $scope.filter = {
        search_user: "",
        date: getDateDefaultFilter()
    };
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function(){
        $scope.find();
    }

    $scope.find = function(){
        $('#searchParamButton').button('loading');
        var param = {
            api_token: api_token
        };
        if ($scope.filter.search_user) {
            param.search_user = $scope.filter.search_user;
        }
        if ($scope.filter.date) {
            param.date = $scope.filter.date;
        }

        url = api_domain + "/api/payment/get-list-user-checkout";
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
                    $scope.users = response.data.data;
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
                $('#searchParamButton').button('reset');
            }
        );
    };

    $scope.reset = function () {
        $scope.filter = {
            date: getDateDefaultFilter()
        }
        $scope.find();
    };

    $scope.showPaymentCheckout = function (ids) {
        var param = {
            api_token: api_token,
            ids: ids.toString()

        };
        url = api_domain + "/api/payment/get-list-order-by-list-id";
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

    $scope.checkoutUser = function (userId, listOrderId, totalCashback) {
        var idTag = '#checkout-user-' + userId;
        $(idTag).button('loading');
        var param = {
            api_token: api_token,
            user_id: userId,
            list_order_id: listOrderId.toString(),
            total_cashback: totalCashback

        };
        url = api_domain + "/api/payment/checkout-user";
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
                    delete $scope.users[userId];
                    showMessage('successful!', 'Checkout successful!', 'successful');
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
                $(idTag).button('reset');
            }
        );
    };

    $scope.checkoutAllUser = function (users) {
        if (Object.keys(users).length > 0) {
            $('#checkoutAllUser').button('loading');
            var param = {
                api_token: api_token,
                users: users
            };
            $http.post(api_domain + "/api/payment/checkout-all-user", param).successful(function (data) {
                if (data.status != 'successful') {
                    delete $scope.users;
                    showMessage('successful!', 'Checkout successful!', 'successful');
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
                $('#checkoutAllUser').button('reset');
            });
        } else {
            showMessage('Error', 'Do not have an user!', 'error');
        }
    }
    
    function getDateDefaultFilter() {
        var date = new Date();
        date.setDate(01);
        date.setMonth(date.getMonth() - 1);
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    this.initialize();


}
