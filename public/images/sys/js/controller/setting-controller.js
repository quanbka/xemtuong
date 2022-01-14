system.controller("SettingController", SettingController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function SettingController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "SettingController";
    $scope.preUpdateParam = {};

    $scope.filter = {
        key: ""
    };
    $scope.newParam = {};

    this.initialize = function(){
        $scope.find();
    }

    $scope.find = function(){
        $('#searchParamButton').button('loading');
        var param = {
            api_token
        };
        if ($scope.filter.key) {
            param.key = $scope.filter.key;
        }
        $scope.isFinding = true;
        url = api_domain + "/api/setting/find";
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
                    $scope.settings = response.data.data;
                } else {
                    alert(response.data.message);
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

    this.initialize();

    $scope.showUpdate = function (param) {
        cloneObject(param, $scope.preUpdateParam);
        param.edit = true;
    };

    $scope.cancelUpdate = function (param) {
        param.edit = false;
        cloneObject($scope.preUpdateParam, param);
    };

    function cloneObject (source, destination) {
        for (var key in source) {
            destination[key] = source[key];
        }
    }

    $scope.update = function (param) {
        if (param.key == null || param.key == "") {
            showMessage("Data invalid", "Please, enter key of param", "error");
            return;
        }
        delete param.edit;
        param.api_token = api_token;
        $http({
            url: api_domain + "/api/setting/update",
            method: "POST",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function(response){
                if (response.data.status != 'successful') {
                    cloneObject($scope.preUpdateParam, param);
                    showMessage("Error", response.data.message, "error");
                } else {
                    showMessage("successful", "Update param successful!", "successful");
                }
            }
        );
    };

    $scope.delete = function (param) {
        if (!confirm("Are you sure delete this param: " + JSON.stringify(param.key))) {
            return;
        }
        $http.post(api_domain + "/api/setting/delete", {key: param.key, api_token: api_token}).successful(function (data) {
            if (data.status != 'successful') {
                showMessage("Error", data.message, "error");
            } else {
                var deletedIndex = -1;
                for (var i = 0; i < $scope.settings.length; i++) {
                    if ($scope.settings[i] === param) {
                        deletedIndex = i;
                        break;
                    }
                }
                $scope.settings.splice(deletedIndex, 1);
                showMessage("successful", "Delete param successful!", "successful");
            }
        });
    };

    $scope.add = function () {
        $('#addParamButton').button('loading');
        if ($scope.newParam.key == null || $scope.newParam.key == "") {
            showMessage("Data invalid", "Please, enter key of param", "error");
            $('#addParamButton').button('reset');
            return;
        }
        $http.post(api_domain + "/api/setting/create", {param: $scope.newParam, api_token: api_token}).successful(function (data) {
            if (data.status != 'successful') {
                showMessage("Error", data.message, "error");
            } else {
                $scope.newParam.id = data.id;
                $scope.settings.unshift($scope.newParam);
                $scope.newParam = {};
                showMessage("successful", "Create param successful!", "successful");
            }
            $('#addParamButton').button('reset');
        });
    };


}
