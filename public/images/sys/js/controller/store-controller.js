system.controller("StoreController", StoreController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function StoreController($scope, $http, $rootScope, $timeout, Upload) {

    $scope.mode = "create";
    $scope.modalTitle = "Add new Store";
    $scope.controllerName = "StoreController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    $scope.store = {};
    $scope.statuses = [
        {
            'code': 'enable',
            'name': 'Enable'
        },
        {
            'code': 'disable',
            'name': 'Disable'
        }
    ];
    this.initialize = function () {
        $scope.getAllCategories();
        $scope.resetFilter();
        $scope.find();
    }

    $scope.getAllCategories = function () {
        url = api_domain + "/api/all-category";
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
                type: 'store'
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
                function (response) {
                    $scope.allCategories = response.data;
                    $scope.rebuildCategories = [];
                    angular.forEach($scope.allCategories, function(category, key) {
                        $scope.rebuildCategories[category.id] = category;
                    });

                }
        );
    }


    // upload on file select or drop
    $scope.upload = function (file, storeObj, type) {
        $('#saveButton').button('loading');
        Upload.upload({
            url: api_domain + '/api/upload/images',
            data: {images: [file], api_token}
        }).then(function (resp) {
            $scope.onUploadNewStoreLogosuccessful(resp, storeObj, type);
        }, function (resp) {
            // showMessage('Error', 'Can not upload this images', 'error');
            $('#saveButton').button('reset');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    };

    $scope.onUploadNewStoreLogosuccessful = function (resp, storeObj, type) {
        if (type == 'banner') {
            storeObj.banner = resp.data[0];
            $scope.previewBanner = cdn_url  + storeObj.banner;
        } else {
            storeObj.logo_url = resp.data[0];
            $scope.previewImg = cdn_url  + storeObj.logo_url;
        }
        $('#saveButton').button('reset');
    }
    $scope.resetFilter = function () {
        $scope.filter = {
            name: "",
            email: "",
            status: "",
            page: 0,
        }
    }

    $scope.find = function () {
        url = api_domain + "/api/store";
        $('#searchStoreButton').button('loading');
        $scope.buildParam();
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
                name: $scope.params.name,
                email: $scope.params.email,
                status: $scope.params.status,
                page_id: $scope.params.page + 1,
                page_size: 15,
                with_user: true,
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
                function (response) {
                    $scope.stores = response.data.data;
                    $scope.pagesCount = response.data.paginator.page_count;
                    $('#searchStoreButton').button('reset');
                }
        );
    }

    $scope.buildParam = function () {
        $scope.params = angular.copy($scope.filter);
        for (var key in $scope.params) {
            // console.log(key);
            if ($scope.params[key] === '') {
                delete ($scope.params[key]);
            }
        }
    }
    $scope.openDialog = function (mode, store) {
        $scope.store = angular.copy(store);
        $scope.mode = mode;
        if (mode == 'update' || mode == 'detail') {
            $scope.modalTitle = "Update Store";
            $scope.mode = mode;
            $scope.store.status = $scope.getByCode($scope.statuses, $scope.store.status);

            $scope.previewImg = cdn_url  + $scope.store.logo_url;

            if ($scope.store.config) {
                var config = JSON.parse($scope.store.config);
                if (config.banner) {
                    $scope.store.banner = config.banner;
                    $scope.previewBanner = cdn_url  + $scope.store.banner;
                }
                if (config.terms) {
                    $scope.store.terms = config.terms;
                }
                if (config.secret) {
                    $scope.store.secret = config.secret;
                }
                if (config.freeshipping) {
                    $scope.store.freeshipping = config.freeshipping;
                }
                if (config.checkoutPage) {
                    $scope.store.checkoutPage = config.checkoutPage;
                }
            }
        } else {
            $scope.modalTitle = "Add new Store";
            $scope.reset(true);
            $scope.store.status = $scope.statuses[0];
        }
        $('#modalStore').modal('show');

    };
    $scope.openCreateOrUpdateDialog = function (mode, item) {
        $scope.previewImg = " ";
        $scope.openDialog(mode, item);
    };
    $scope.reset = function (notResetFilter) {
        if (!notResetFilter) {
            $scope.filter = {};
        }
        $scope.store = {};
        $scope.previewImg = "";
        $scope.previewBanner = "";
        $scope.mode = "create";
        $scope.store.status = $scope.statuses[0];
        $scope.find();
    };


    $scope.save = function (mode) {
        var data = buildData();
        if (!data) {
            return false;
        }
        $('#saveButton').button('loading');
        var method = "POST";
        url = api_domain + "/api/store";
        if (mode == 'update') {
            method = "PUT";
            url += "/" + $scope.store.id;
        }
        $http({
            url: url,
            method: method,
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: data

        }).then(
                function (response) {
                    if (response.data.status == 'successful') {
                        showMessage(mode + ' store', 'The store has been ' + mode + 'd!', 'successful');
                        $('#saveButton').button('reset');
                        $('#modalStore').modal('hide');
                        $scope.error = {};
                        $scope.find();
                    } else {
                        $scope.error = response.data.message;
                    }
                },
                function error(response) {
                    $('#saveButton').button('reset');
                    showMessage('Can not ' + mode + '!', 'Please contact technical team for support!', 'error');

                }
        );
    }

    $scope.showEditStoreForm = function (store) {
        // console.log(store);
        $scope.editStore = angular.copy(store);
        $scope.previewImg = cdn_url  + $scope.editStore.logo_url;
        delete($scope.editStore.updated_at);
        $('#editStoreForm').modal('show');
    }

    $scope.getCdnUrl = function(url) {
        return cdn_url + url;
    }

    $scope.updateStore = function () {
        $('#updateStoreButton').button('loading');
        url = api_domain + "/api/store/" + $scope.editStore.id;
        $http({
            url: url,
            method: "PUT",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: $scope.editStore

        }).then(
                function (response) {
                    $('#updateStoreButton').button('reset');
                    if (response.data.status == 'successful') {
                        showMessage('successful', 'The store has been updated', 'successful');
                        $('#editStoreForm').modal('hide');
                        $scope.find();
                    } else {
                        showMessage(response.data.status, response.data.title, response.data.status);
                    }
                },
                function error(response) {
                    $('#updateStoreButton').button('reset');
                    showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

                }
        );
    }

    $scope.showDeleteStoreForm = function (store) {
        $scope.deleteStore = angular.copy(store);
        $('#deleteStoreForm').modal('show');
    }

    $scope.destroyStore = function () {
        url = api_domain + "/api/store/" + $scope.deleteStore.id;
        $http({
            url: url,
            method: "DELETE",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: $scope.deleteStore

        }).then(
                function (response) {
                    showMessage(response.data.status, response.data.title, response.data.status);
                    if (response.data.status == 'successful') {
                        $('#deleteStoreForm').modal('hide');
                        $scope.find();
                    } else {
                        showMessage('successful', 'The store has been deleted', 'successful');
                    }
                },
                function error(response) {
                    showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

                }
        );
    }

    $scope.onTitleChange = function () {
        $scope.store.slug = $scope.toFriendlyString($scope.store.name);
    };
    function buildData() {
        var retVal = {};
        var message = "";
        if (!$scope.store.name) {
            message += "Name required<br/>";
        }

        if (!$scope.store.slug) {
            message += "Slug required<br/>";
        }

        if (!$scope.store.cash_back_rate) {
            message += "Cashback rate required<br/>";
        }
        if (!$scope.store.origin_url) {
            message += "Origin url required<br/>";
        }
        if (!$scope.store.category_id) {
            message += "Category required<br/>";
        }
        if (message) {
            showMessage('Error', message, 'error', 'glyphicon-remove');
            return false;
        }
        retVal.name = $scope.store.name;
        retVal.origin_url = $scope.store.origin_url;
        retVal.affiliate_url = $scope.store.affiliate_url;
        retVal.cash_back_rate = $scope.store.cash_back_rate;
        retVal.id = $scope.store.id;
        retVal.slug = $scope.store.slug;
        retVal.description = $scope.store.description;
        retVal.meta_title = $scope.store.meta_title;
        retVal.meta_description = $scope.store.meta_description;
        retVal.meta_keywords = $scope.store.meta_keywords;
        retVal.status = $scope.store.status.code;
        retVal.category_id = $scope.store.category_id;
        retVal.logo_url = $scope.store.logo_url;
        var config = {};
        if ($scope.store.banner) {
            config.banner = $scope.store.banner;
        }
        if ($scope.store.freeshipping) {
            config.freeshipping = $scope.store.freeshipping;
        }
        if ($scope.store.secret) {
            config.secret = $scope.store.secret;
        }
        if ($scope.store.terms) {
            config.terms = $scope.store.terms;
        }
        if ($scope.store.checkoutPage) {
            config.checkoutPage = $scope.store.checkoutPage;
        }
        retVal.config = JSON.stringify(config);
        return retVal;
    }

    this.initialize();

}
