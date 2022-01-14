system.controller("AdsController", AdsController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function AdsController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "AdsController";
    this.__proto__ = new BaseController($scope, $http, $rootScope, Upload);

    $scope.ads = [];
    $scope.mode = 'add';
    $scope.adv = {};
    $scope.advPositions = advPositions;
    $scope.devices = devices;
    $scope.pages = pages;
    $scope.statuses = ['enable', 'disable'];

    function init() {
        $scope.find();
    }

    function resetAdvertise() {
        $scope.adv = {
            title: '',
            url: '',
            image_url: '',
            start_date: '',
            end_date: '',
            status: 'enable',
            positions: [
                {
                    position: '',
                    device: 'desktop',
                    page: 'general'
                }
            ]
        };
    }

    $scope.find = function () {
        $http.get('/api/advertise?embeds=positions').then(function (res) {
            if (res.data.status == 'successful') {
                $scope.ads = res.data.result;
            }
        })
    }

    $scope.showModal = function (item) {
        if (item) {
            $scope.mode = 'edit';
            $scope.adv = {
                id: item.id,
                title: item.title,
                url: item.url,
                image_url: item.image_url,
                start_date: item.start_date,
                end_date: item.end_date,
                status: item.status,
                positions: angular.copy(item.positions),
            };
            $scope.adv.start_date = $scope.summarizeDate($scope.adv.start_date, true);
            $scope.adv.end_date = $scope.summarizeDate($scope.adv.end_date, true);
        } else {
            $scope.mode = 'add';
            resetAdvertise();
        }

        $('#js-modal-ads').modal('toggle');
    }

    $scope.uploadImage = async function (files) {
        if (files.length > 0) {
            let url = await $scope.upload(files[0]);
            if (url) {
                $scope.adv.image_url = url;
            }
        }
    }

    function validate() {
        let retVal = true;
        for (key of Object.keys($scope.adv)) {
            if (!$scope.adv[key]) {
                toastr.error('Vui lòng không để trống trường ' + key );
                retVal = false;
                break;
            }
        }

        for (item of $scope.adv.positions) {
            if (!item.position) {
                toastr.error('Vui lòng không để trống trường position');
                retVal = false;
                break;
            }
        }

        return retVal;
    }

    function buildData() {
        let retVal = angular.copy($scope.adv);
        retVal.start_date += ' 00:00:00';
        retVal.end_date += ' 23:59:59';
        retVal.start_date = $scope.vietnameseTimeToSQLTime(retVal.start_date);
        retVal.end_date = $scope.vietnameseTimeToSQLTime(retVal.end_date);

        return retVal;
    }

    $scope.save = function () {
        if (validate()) {
            let data = buildData();
            if ($scope.mode == 'add') {
                $http.post('/advertise', data)
                    .then(function (res) {
                        if (res.data.status == 'successful') {
                            toastr.successful('Thêm quảng cáo thành công');
                            $scope.closeModal();
                            $scope.find();
                        } else {
                            toastr.error('Thêm quảng cáo thất bại');
                        }
                    }, function (error) {
                        toastr.error('Thêm quảng cáo thất bại');
                    });
            } else {
                $http.put('/advertise/' + data.id, data)
                    .then(function (res) {
                        if (res.data.status == 'successful') {
                            toastr.successful('Thêm quảng cáo thành công');
                            $scope.closeModal();
                            $scope.find();
                        } else {
                            toastr.error('Thêm quảng cáo thất bại');
                        }
                    }, function (error) {
                        toastr.error('Thêm quảng cáo thất bại');
                    });
            }
        }
    }

    $scope.delete = function (item) {
        if (confirm('Bạn muốn xóa quảng cáo ' + item.title + ' không?')) {
            $http.delete('/api/advertise/' + item.id)
                .then(function (res) {
                    $scope.find();
                });
        }
    }

    $scope.closeModal  = function () {
        $('#js-modal-ads').modal('toggle');
    }

    $scope.deletePosition = function (index) {
        $scope.adv.positions.splice(index, 1);
    }

    $scope.addPosition = function () {
        $scope.adv.positions.push({
            position: '',
            device: 'desktop',
            page: 'general'
        })
    }

    init();
}