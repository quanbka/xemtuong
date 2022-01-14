system.requires.push('ngFileUpload');
system.controller("BannerController", BannerController);

function BannerController($scope, $http, $rootScope, Upload) {
    var self = this;
    $scope.controllerName = "BannerController";
    $scope.items = null;
    $scope.photos = [];
    $scope.banner = {};

    //--------------------------------------------------------------------------
    //  Initialization

    $scope.baseController = this.__proto__ = new BaseController($scope, $http, $rootScope);
    function initialize() {
        $scope.find();
    }

    $scope.find = function () {
        $http({
            url: api_domain + "/api/setting/find",
            method: "GET",
            params: {
            api_token: api_token,
            key:"slides",
        },
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    $scope.items = response.data.data;
                for(var i=0; i<$scope.items.length; i++) {
                    $scope.items[i].value = JSON.parse($scope.items[i].value);
                }
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
            }
        );
    };

    $scope.$watch('images', function () {
        $scope.uploadDataFile($scope.images, $scope.banner);
    });
    $scope.uploadDataFile = function (images, banner) {
        if (images && images.length) {
            if (!confirm("Bạn có muốn Upload ảnh?")) {
                return;
            }
        $('#saveButton').button('loading');
        Upload.upload({
            url: api_domain + '/api/upload/images',
            data: {images: images, api_token}
        }).then(function (res) {
            var data = res.data;
            $scope.photos.push({image_url: cdn_url + data[0], title: data.fileName, alt: data.fileName});
            banner['images'] = $scope.photos;
            $('#saveButton').button('reset');
        }, function (resp) {
            // showMessage('Error', 'Can not upload this images', 'error');
            $('#saveButton').button('reset');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
//                Upload.upload({
//                    url: '/system/banner/upload_image',
//                    file: image
//                }).successful(function (data) {
//                    if (data.status && data.status == 'successful') {
//                        $scope.photos.push({image_url: imageSourceBaseUrl + data.image_url, title: data.fileName, alt: data.fileName});
//                        banner['images'] = $scope.photos;
//                    } else {
//                        alert("Có lỗi xảy ra trong quá trình Upload!");
//                    }
//                });
        }
    };

    $scope.removeImage = function(idx, image_url) {
        if (image_url == null) {
            var count = $scope.photos.length;
            if (count == 1) {
                alert('Can\'t remove option value input default.');
            } else {
                $scope.photos.splice(idx, 1);
            }
            var count = $scope.photos.length;
            $scope.index = count - 1;
        } else {
            if (!confirm("Bạn có muốn xóa bỏ ảnh này?")) {
                return;
            }
            var url = api_domain + "/api/upload/unlink";
            var dataPost = {paths: [image_url],api_token: api_token};
            $http.post(url, dataPost).successful(function (data) {
                if (data.status) {
                    $scope.photos.splice(idx, 1);
                } else {

                }
            });


        }
    }

    $scope.save = function() {
        
        if(!$scope.banner.images || $scope.banner.images.length < 0) {
            alert('Yêu cầu upload ảnh');
            return;
        }

        $scope.showLoading();
        for(var i=0; i<$scope.banner.images.length; i++) {
            delete $scope.banner.images[i].$$hashKey;
        }
        $scope.banner.value = JSON.stringify($scope.banner.images);
        delete $scope.banner.images;
        var postData ={};
         var url = "/api/setting/update";
        if($scope.mode == "create") {
            url="/api/setting/create";
             postData = {param: $scope.banner,api_token: api_token};
        }else{
            $scope.banner.api_token = api_token;
             postData = $scope.banner;
        }
        url = api_domain + url;
        $http.post(url,postData).successful(function (data) {
            $scope.hideLoading();
            if (!data.status) {
                alert("Xảy ra lỗi trong quá trình xử lý!");
            }
            $('#bannerForm').modal('toggle');
            $scope.find();
        });
    }

    $scope.openDialog = function (item, mode) {
        if(mode == 'create') $scope.banner = {};

        if (mode === 'update') {
            $scope.photos = [];
            $scope.banner = angular.copy(item);
            var value = $scope.banner.value;
            if(value.length > 0) {
                for(var i=0; i<value.length; i++) {
                    $scope.photos.push({image_url: value[i].image_url, url: value[i].url, title: value[i].title, alt: value[i].alt, pos: value[i].pos});
                    $scope.banner['images'] = $scope.photos;
                }
            }
        }

        switch(mode) {
            case 'update':
                $scope.mode = "update";
                break;
            default:
                $scope.mode = "create";
        }

        $('#bannerForm').modal({
            modal: true,
            persist: true,
            position: [30, 0],
            autoPosition: true
        });
    };

    $scope.delete = function(param) {
        if (!confirm("Bạn có múa xóa tham số: " + JSON.stringify(param.key2))) {
            return;
        }
        $scope.showLoading();
        $http.post(api_domain + "/api/setting/delete", {key: param.key, api_token: api_token}).successful(function (data) {
            $scope.hideLoading();
            if (!data.status) {
                alert("Xảy ra lỗi trong quá trình xử lý!");
            } else {
                $scope.find();
            }
        });
    };

    $scope.megaSortable = function(action, index) {
        if(action == 'up') {
            var prePosition = index - 1;
            var temp = $scope.banner.images[index];
            $scope.banner.images[index] = $scope.banner.images[prePosition];
            $scope.banner.images[prePosition] = temp;
        }

        if(action == 'down') {
            var nextPosition = index + 1;
            var temp = $scope.banner.images[index];
            $scope.banner.images[index] = $scope.banner.images[nextPosition];
            $scope.banner.images[nextPosition] = temp;
        }
    }

    initialize();
}