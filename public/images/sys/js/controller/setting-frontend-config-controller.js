system.controller("SettingFrontendConfigController", SettingFrontendConfigController);

/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function SettingFrontendConfigController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "SettingFrontendConfigController";
    $scope.tinymceModel = 'Initial content';

    $scope.tinymceOptions = {
        plugins: 'link code',
        // toolbar: 'undo redo | styleselect | bold italic | link  | code | list',
        content_css: '/sys/css/tinymce.css'
    };

    $scope.listTopStore = [];
    $scope.allStores = [];

    $scope.stores = allStores;
    angular.forEach($scope.stores, function (store, key) {
        $scope.allStores[store.id] = store;
    });

    $scope.topStoreIdSelected = listTopStoreSelected ? listTopStoreSelected.split(',').map(Number) : [];
    $scope.topStoreSelected = [];
    var sorder = 1;
    angular.forEach($scope.topStoreIdSelected, function (id, key) {
        if (typeof $scope.allStores[id] != 'undefined') {
            $scope.allStores[id].sorder = sorder;
            $scope.topStoreSelected.push($scope.allStores[id]);
            sorder ++;
        }
    });
    $scope.init = function () {
        $scope.getAllConfigs();
        $scope.getAllStores();
    }

    $scope.getAllStores = function () {
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
            function (response) {
                $scope.allStores = response.data;
                $scope.rebuildStores = [];
                angular.forEach($scope.allStores, function (store, key) {
                    $scope.rebuildStores[store.id] = store;
                });
            }
        );
    }

    $scope.upload = function (file, store) {
        Upload.upload({
            url: api_domain + '/api/upload/images',
            data: {images: [file], api_token}
        }).then(function (resp) {
            $scope.onUploadNewStoreBannersuccessful(resp, store);
        }, function (resp) {
            showMessage('Error', 'Can not upload this images', 'error');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    };

    $scope.onUploadNewStoreBannersuccessful = function (resp, store) {
        store.banner_url = resp.data[0];
    }


    // Get all config
    $scope.getAllConfigs = function () {
        url = api_domain + "/api/setting/find";
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
            function (response) {
                $scope.configs = [];
                angular.forEach(response.data.data, function (value, key) {
                    $scope.configs[value.key] = value;
                });
                if ($scope.configs['featureDailyStores']) {
                    $scope.featureDailyStoresConfig = JSON.parse($scope.configs['featureDailyStores'].value);
                }
                if ($scope.configs['comments']) {
                    $scope.commentsConfig = JSON.parse($scope.configs['comments'].value);
                }
                if ($scope.configs['storeWidget']) {
                    $scope.storeWidgetConfig = JSON.parse($scope.configs['storeWidget'].value);
                }
                if ($scope.configs['footer']) {
                    $scope.footerConfig = JSON.parse($scope.configs['footer'].value);
                }
                if ($scope.configs['menu']) {
                    $scope.menuConfig = JSON.parse($scope.configs['menu'].value);
                }
                if ($scope.configs['storeBannerIds']) {
                    $scope.storeBannerConfig = JSON.parse($scope.configs['storeBannerIds'].value);
                } else {
                    $scope.storeBannerConfig = [];
                }

            }
        );
    }

    $scope.upMenu = function (item) {
        if (item > 0) {
            $scope.swapMenu(item, item - 1);
        }
    }

    $scope.downMenu = function (item) {
        if (item < $scope.menuConfig.length - 1) {
            $scope.swapMenu(item, item + 1);
        }
    }

    $scope.swapMenu = function (indexS, indexD) {
        var temp = $scope.menuConfig[indexS];
        $scope.menuConfig[indexS] = $scope.menuConfig[indexD];
        $scope.menuConfig[indexD] = temp;
        $scope.color[indexS] = "wheat";
        $scope.color[indexD] = "wheat";
        setTimeout(function () {
            $scope.color[indexS] = "";
            $scope.color[indexD] = "";
        }, 1500);
    }

    $scope.addItem = function (item, array) {
        array.push(item);
    }

    $scope.removeItem = function (index, array) {
        array.splice(index, 1);
    }

    $scope.addMenuItem = function (item) {
        var newMenuItem = angular.copy(item);
        if (newMenuItem) {
            $scope.menuConfig.push(newMenuItem);
            $scope.newItem = {};
        }
    }

    $scope.color = [];

    $scope.removeMenuItem = function (index) {
        $scope.menuConfig.splice(index, 1);
    }

    $scope.updateStoreBanner = function () {
        console.log($scope.storeBannerConfig);
        $scope.updateConfig('storeBannerIds', $scope.storeBannerConfig);
    }

    $scope.updateMenu = function () {
        $scope.updateConfig('menu', $scope.menuConfig);
    }


    $scope.updateFooterConfig = function () {
        $scope.updateConfig('footer', $scope.footerConfig);
    }


    $scope.updateConfig = function (key, config) {
        var param = {
            key: key,
            api_token: api_token,
            value: JSON.stringify(config),
        };

        $http({
            url: api_domain + "/api/setting/update",
            method: "POST",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function (response) {
                if (response.data.status != 'successful') {
                    cloneObject($scope.preUpdateParam, param);
                    showMessage("Error", response.data.message, "error");
                } else {
                    showMessage("successful", "Update param successful!", "successful");
                }
            }
        );
    }

    $scope.updateFeatureDailyStores = function () {
        $scope.updateConfig('featureDailyStores', $scope.featureDailyStoresConfig);
    }

    $scope.updateComments = function () {

        $scope.updateConfig('comments', $scope.commentsConfig);

    }

    $scope.updateStoreWidget = function () {

        $scope.updateConfig('storeWidget', $scope.storeWidgetConfig);
    }

    $scope.init();

    $scope.searchNameChangeGift = function (name) {
        $scope.listTopStore = [];
        if (name.length < 1) {
            return;
        }
        $scope.isShowRelatedTopStore = true;
        var i = 0;
        var searchNameStore = name.toLowerCase();
        $scope.allStores.forEach(function (store) {
            var text = store.name.toLowerCase();
            if (i >= 8) {
                return;
            }
            if (text && text.indexOf(searchNameStore) != -1) {
                $scope.listTopStore.push(store);
                i++;
            }
        });
    };

    $scope.closeSelect = function () {
        $scope.isShowRelatedTopStore = false;
    };

    $scope.addStore = function (store) {
        if (typeof store != 'undefined') {
            var is_duplicate = false;
            angular.forEach($scope.topStoreSelected, function (storeSelected, key) {
                if (storeSelected.id == store.id) {
                    alert('Duplicate store!!!');
                    is_duplicate = true;
                    return;
                }
            });
            if (!is_duplicate) {
                store.sorder = $scope.topStoreSelected.length + 1;
                $scope.topStoreSelected.push(store);
                $scope.isShowRelatedTopStore = false;
            }
        }
    };

    $scope.deleteStoreSelected = function (store) {
        var keyStore = -1;
        angular.forEach($scope.topStoreSelected, function (storeSelected, key) {
            if (storeSelected.id == store.id) {
                keyStore = key;
                return;
            }
        });
        if (keyStore > -1) {
            $scope.topStoreSelected.splice(keyStore, 1);
        }
    }

    $scope.updateTopStores = function () {
        var listStore = angular.copy($scope.topStoreSelected);
        listStoreId = '';
        if (listStore) {
            listStore.sort(compareSorder);
            arrId = [];
            angular.forEach(listStore, function (storeSelected, key) {
                arrId.push(storeSelected.id);
            });
            listStoreId = arrId.join();
        }
        var param = {
            api_token,
            idStores: listStoreId
        };
        $http({
            url: api_domain + "/api/store/update-top-stores",
            method: "POST",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function (response) {
                if (response.data.status != 'successful') {
                    showMessage("Error", response.data.message, "error");
                } else {
                    showMessage("successful", "Update successful!", "successful");
                }
            }
        );
    }

    function compareSorder(a, b) {
        if (a.sorder === b.sorder) {
            return 0;
        }
        else {
            return (a.sorder < b.sorder) ? -1 : 1;
        }
    }




}
