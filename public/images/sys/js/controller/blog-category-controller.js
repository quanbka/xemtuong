system.controller("CategoryController", CategoryController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function CategoryController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "CategoryController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function () {
        $scope.filter = {};
        $scope.getCategories();
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
            url : "/api/post-category",
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getCategories();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }

    $scope.update = function(){
        $http({
            method : "put",
            url : "/api/post-category/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getCategories();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }



    $scope.getCategories = function(){
        $http({
            method : "GET",
            url : "/api/post-category",
            params : {
                api_token : api_token,
                page_size : 20,
                page: $scope.page_id,
                category_id: $scope.filter.category_id,
                order_by: '-id'
            }
        }).then(function mysuccessful(response) {
            $scope.categories = response.data.data.data;
            $scope.pagesCount = response.data.data.last_page;
        }, function myError(response) {
            $scope.categories = [];
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
