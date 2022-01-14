system.controller("ConfigController", ConfigController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function ConfigController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "ConfigController";

    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false,
      filebrowserBrowseUrl: '/laravel-filemanager?type=Files',
      height:500
    }
    this.__proto__ = new BaseController($scope, $http, $rootScope, Upload);
    $scope.config = config;
    if ($scope.config.type == 'slide') {
        $scope.config.value = JSON.parse($scope.config.value);
    }
    $scope.fileds = [
        {
            'field': 'id',
            'editable': false,
            'label': "ID",
            'type': 'text'
        },
        {
            'field': 'key',
            'editable': false,
            'label': "Key",
            'type': 'text'
        },
        {
            'field': 'value',
            'editable': true,
            'label': "Giá trị",
            'type': 'textarea'
        },
    ];

    $scope.uploadSlideImage = async function (file, item) {
        if (file) {
            var image = await $scope.upload(file);
            if (image) {
                $scope.$applyAsync(function () {
                    item.image_url = image;
                });
            }
        }
    };

    $scope.uploadImage = async function (file) {
        if (file) {
            var image = await $scope.upload(file);
            if (image) {
                $scope.$applyAsync(function () {
                    $scope.config.value = image;
                });
            }
        }
    };

    $scope.addSlide = function () {
        $scope.config.value.push({
            image_url: '',
            text: '',
            url: ''
        });
    }

    $scope.removeSlide = function ($index) {
        $scope.config.value.splice($index, 1);
    }

    $scope.thumbnail = function (config) {
        let img = config.image_url;
        if (img) {
            ext = (img.substr(img.length - 3))
            if (ext == 'pdf') {
                return '/pdf.png';
            }
        }
        return config.image_url;
    }

    $scope.save = function () {
        let data = angular.copy($scope.config);
        if ($scope.config.type == 'slide') {
            data.value = JSON.stringify($scope.config.value);
        }
        $http.put($scope.buildApiUrl('/api/config/' + $scope.config.id), data)
            .then(function (res) {
                if (res.data.status == 'successful') {
                    toastr.successful('Thành công');
                } else {
                    toastr.error('Đã có lỗi xảy ra');
                }
            }, function (error) {
                toastr.error('Đã có lỗi xảy ra');
            })
    }
}
