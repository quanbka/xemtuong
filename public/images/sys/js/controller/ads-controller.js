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
                toastr.error('Vui l??ng kh??ng ????? tr???ng tr?????ng ' + key );
                retVal = false;
                break;
            }
        }

        for (item of $scope.adv.positions) {
            if (!item.position) {
                toastr.error('Vui l??ng kh??ng ????? tr???ng tr?????ng position');
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
                            toastr.successful('Th??m qu???ng c??o th??nh c??ng');
                            $scope.closeModal();
                            $scope.find();
                        } else {
                            toastr.error('Th??m qu???ng c??o th???t b???i');
                        }
                    }, function (error) {
                        toastr.error('Th??m qu???ng c??o th???t b???i');
                    });
            } else {
                $http.put('/advertise/' + data.id, data)
                    .then(function (res) {
                        if (res.data.status == 'successful') {
                            toastr.successful('Th??m qu???ng c??o th??nh c??ng');
                            $scope.closeModal();
                            $scope.find();
                        } else {
                            toastr.error('Th??m qu???ng c??o th???t b???i');
                        }
                    }, function (error) {
                        toastr.error('Th??m qu???ng c??o th???t b???i');
                    });
            }
        }
    }

    $scope.delete = function (item) {
        if (confirm('B???n mu???n x??a qu???ng c??o ' + item.title + ' kh??ng?')) {
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