system.controller("DealController", DealController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function DealController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "DealController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);

    this.initialize = function(){

        $scope.initDealTypes();
        $scope.getAllStores();
        $scope.initStatuses();
        $scope.initNewDeal();
        $scope.resetFilter();
        $scope.getDeals();
    }

    $scope.initDealTypes = function() {
        $scope.types = [
            {
                'name' : 'coupon',
                'display_name' : 'Coupon'
            },
            // {
            //     'name' : 'category',
            //     'display_name' : 'category'
            // }, // Temporory disable category
            {
                'name' : 'code',
                'display_name' : 'Code'
            },
            {
                'name' : 'printable',
                'display_name' : 'Printable',
            }
        ];
    }

    $scope.getAllStores = function() {
        url = api_domain + "/api/all-store";
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
            function(response){
                $scope.allStores = response.data;
                $scope.rebuildStores = [];
                angular.forEach($scope.allStores, function(store, key) {
                    $scope.rebuildStores[store.id] = store;
                });
            }
        );
    }

    $scope.initStatuses = function(){
        $scope.statuses = [
            {
                'value' : 'enable',
                'name' : 'Enable'
            },
            {
                'value' : 'unreliable',
                'name' : 'Unreliable'
            },
            {
                'value' : 'future',
                'name' : 'Future'
            },
            {
                'value' : 'pending',
                'name' : 'Pending'
            },
            {
                'value' : 'delete',
                'name' : 'Delete'
            }
        ];
    }

    // upload on file select or drop
    $scope.upload = function (file, dealObj) {
        console.log($scope.newDeal);
        console.log(dealObj);
        $('#createDealButton').button('loading');
        Upload.upload({
            url : api_domain + '/api/upload/images',
            data: {images: [file], api_token}
        }).then(function (resp) {
            $scope.onUploadNewDealLogosuccessful(resp, dealObj);
        }, function (resp) {
            // showMessage('Error', 'Can not upload this images', 'error');
            $('#createDealButton').button('reset');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    };

    $scope.onUploadNewDealLogosuccessful = function(resp, dealObj) {
        dealObj.image_url = resp.data[0];
        $scope.previewImg = cdn_url + dealObj.image_url ;
        $('#createDealButton').button('reset');
    }

    $scope.initNewDeal = function(){
        $scope.newDeal = {
            'status': 'enable',
            'store_id': ($scope.newDeal)?$scope.newDeal.store_id:"",
            'cash_back_rate': ($scope.newDeal)?$scope.newDeal.cash_back_rate:"",
        }
    };

    $scope.resetFilter = function(){
        $scope.filter = {
            name: "",
            email: "",
            status: "",
            page: 0,
        }
    }

    $scope.getDeals = function(){
        url = api_domain + "/api/deal";
        $('#searchDealButton').button('loading');
        $scope.buildParam();
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
                title: $scope.params.name,
                email: $scope.params.email,
                status: $scope.params.status,
                is_hot_deal: $scope.params.is_hot_deal,
                page_id : $scope.params.page + 1,
                store_id : $scope.params.store_id,
                page_size : 15,
                with_user : true,
                ordersStatus: 'asc'
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
            function(response){
                $scope.deals = response.data.data;
                $scope.pagesCount = response.data.paginator.page_count;
                $('#searchDealButton').button('reset');
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
        $scope.getDeals();
    }

    $scope.showCreateDealForm = function(){
        $scope.isSlugFocus = false;
        $scope.previewImg = "";
        // console.log((new Date()).toISOString().substring(0, 10));
        $scope.newDeal.published_at = moment().tz("America/New_York").format().substring(0, 10);
        // console.log(now);
        // console.log($scope.newDeal);
        $('#createDealForm').modal('show');
    }



    $scope.createDeal = function(){
        $('#createDealButton').button('loading');
        url = api_domain + "/api/deal";
        $http({
            url: url,
            method: "POST",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: $scope.newDeal

        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    showMessage('Created deal', 'The deal has been created!', 'successful');
                    $('#createDealButton').button('reset');
                    $('#createDealForm').modal('hide');
                    $scope.initNewDeal();
                    $scope.error = {};
                    $scope.getDeals();
                } else {
                    $scope.error = response.data.message;
                }
            },
            function error(response){
                $('#createDealButton').button('reset');

                var array = $.map(response.data, function(value, index) {
                    return [value];
                });


                for (var i = 0; (i < array.length && i < 2); i++) {
                    showMessage("Please check you input", array[i][0], 'caution');
                }

            }
        );
    }

    $scope.showEditDealForm = function(deal){
        $scope.editDeal = angular.copy(deal);
        if($scope.editDeal.image_url){
            $scope.previewImg = cdn_url + $scope.editDeal.image_url ;
        }
        delete($scope.editDeal.updated_at);
        $('#editDealForm').modal('show');
    }

    $scope.updateDeal = function(){
        $('#updateDealButton').button('loading');
        url = api_domain + "/api/deal/" + $scope.editDeal.id;
        $http({
            url: url,
            method: "PUT",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: $scope.editDeal

        }).then(
            function(response){
                $('#updateDealButton').button('reset');
                if (response.data.status == 'successful') {
                    showMessage('successful', 'The deal has been updated', 'successful');
                    $('#editDealForm').modal('hide');
                    $scope.getDeals();
                } else {
                    showMessage(response.data.status, response.data.title, response.data.status);
                }
            },
            function error(response){
                $('#updateDealButton').button('reset');
                showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

            }
        );
    }

    $scope.showDeleteDealForm = function(deal){
        $scope.deleteDeal = angular.copy(deal);
        $('#deleteDealForm').modal('show');
    }

    $scope.destroyDeal = function(){
        url = api_domain + "/api/deal/" + $scope.deleteDeal.id;
        $http({
            url: url,
            method: "DELETE",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: $scope.deleteDeal

        }).then(
            function(response){
                showMessage(response.data.status, response.data.title, response.data.status);
                if (response.data.status == 'successful') {
                    $('#deleteDealForm').modal('hide');
                    $scope.getDeals();
                } else {
                    showMessage('successful', 'The deal has been deleted', 'successful');
                }
            },
            function error(response){
                showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

            }
        );
    }

    $scope.onChangeDealName = function(){
        if(!$scope.isSlugFocus){
            $scope.newDeal.slug = $scope.slugify($scope.newDeal.title);
        }
    }

    $scope.saveSortOrder = function(item){
        url = api_domain + "/api/deal/" + item.id;
        $http({
            url: url,
            method: "PUT",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: item

        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    showMessage('successful', 'The deal has been updated', 'successful');
                    $scope.getDeals();
                } else {
                    showMessage(response.data.status, response.data.title, response.data.status);
                }
            },
            function error(response){
                showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

            }
        );
    }

    $scope.slugify = function(name){
        return name.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/&/g, '-and-')         // Replace & with 'and'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    }

    $scope.saveSortOrders = function (items) {
        var idSubmit = '#submit-order';
        $(idSubmit).button('loading');
        var param = {
            items: items,
            api_token: api_token
        };
        $http.post(api_domain + "/api/deal/update-multi-order", param).successful(function (data) {
            if (data.status == 'successful') {
                showMessage('successful!', 'Update successful!', 'successful');
                $scope.getDeals();
            } else {
                showMessage('Error', data.message, 'error');
            }
            $(idSubmit).button('reset');
        });
    }

    this.initialize();

}
