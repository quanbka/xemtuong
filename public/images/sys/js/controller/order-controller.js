system.controller("OrderController", OrderController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function OrderController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "OrderController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function () {
        $scope.filter = {};
        $scope.getProducts();
        $scope.getOrders();
        $scope.modes =
            {
            create : {
                title : "Tạo sản phẩm mới",
                buttonLabel: "Tạo",

            },
            edit : {
                title : "Sửa sản phẩm",
                buttonLabel: "Sửa",

            }
        };

    }

    $scope.getProducts = function(){
        $scope.products = [];
        $http({
            method : "GET",
            url : "/api/product",
            params : {
                api_token : api_token,
                page_size : 0
            }
        }).then(function mysuccessful(response) {
            array = response.data.data.data;
            for (var i = 0; i < array.length; i++) {
                // console.log(array[i])
                $scope.products[array[i].id] = array[i];
            }
        }, function myError(response) {
            $scope.products = [];
        });
    }

    $scope.createOrUpdate = function(){
        console.log($scope.mode)
        if($scope.mode == 'create'){
            $scope.create();
        }

        if($scope.mode == 'edit'){
            $scope.update();
        }
    }

    $scope.create = function(){

        console.log($scope.object);
        $http({
            method : "post",
            url : "/api/order",
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getOrders();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }

    $scope.update = function(){
        $http({
            method : "put",
            url : "/api/order/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getOrders();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }



    $scope.getOrders = function(){
        $http({
            method : "GET",
            url : "/api/order",
            params : {
                api_token : api_token,
                page_size : 20,
                page: $scope.page_id,
                order_id: $scope.filter.order_id,
                order_by: '-id'
            }
        }).then(function mysuccessful(response) {
            $scope.orders = response.data.data.data;
            $scope.pagesCount = response.data.data.last_page;
        }, function myError(response) {
            $scope.orders = [];
        });
    }

    $scope.showCreateForm = function(){
        $scope.mode = 'create';
        $scope.object = {};
        // $('#objectForm').modal('show');
    }

    $scope.showEditForm = function(object){
        $scope.mode = 'edit';
        $scope.object = object
        $scope.object = $scope.buildObject($scope.object);
        // $('#objectForm').modal('show');
    }

    $scope.buildObject = function(object){
        object = object;

        // object.slides = (object.slides);
        // object.slides = (JSON.parse(object.slides))

        return object;
    }

    $scope.showDeleteForm = function(){
        $scope.mode = 'delete';
        $('#deleteForm').modal('show');

    }

    $scope.options = options

      // Called when the editor is completely ready.
      $scope.onReady = function () {
        // ...
      };

      $scope.remove = function(key){
          console.log($scope.object.slides)
          $scope.object.slides.splice(key, 1)
          $scope.object.slides = $scope.object.slides;
          console.log(key);
      }

    this.initialize();

}
