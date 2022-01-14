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
        $scope.getAllCategories();
        $scope.getCategories();
        $scope.showSlide = true;
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
        $scope.object = $scope.rebuild($scope.object);
        if($scope.mode == 'create'){
            $scope.create();
        }
        if($scope.mode == 'edit'){
            $scope.update();
        }
    }
    $scope.rebuild = function () {

        return $scope.object;
    }
    $scope.create = function(){
        $http({
            method : "post",
            url : "/api/category",
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
            url : "/api/category/" + $scope.object.id,
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
    $scope.delete = function(){
        $http({
            method : "delete",
            url : "/api/category/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getCategories();
            $('#deleteForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }
    $scope.getAllCategories = function(){
        $scope.allCategories = [];
        $http({
            method : "GET",
            url : "/api/category",
            params : {
                api_token : api_token,
                page_size : 0,
            }
        }).then(function mysuccessful(response) {
            array = response.data.data.data;
            for (var i = 0; i < array.length; i++) {
                $scope.allCategories[array[i].id] = array[i];
            }
            console.log($scope.allCategories);
        }, function myError(response) {
            $scope.allCategories = [];
        });
    }
    $scope.getCategories = function(){
        params = {
            api_token : api_token,
            page_size : 20,
            page: $scope.page_id,
            category_id: $scope.filter.category_id,
            order_by: '-id',
            with: 'category',
            // 'name~dell' : '',
        };
        if ($scope.filter.name) {
            params['name~' + $scope.filter.name] = '';
        }
        $http({
            method : "GET",
            url : "/api/category",
            params : params
        }).then(function mysuccessful(response) {
            $scope.categories = response.data.data.data;
            $scope.pagesCount = response.data.data.last_page;
        }, function myError(response) {
            $scope.categories = [];
        });
    }
    $scope.showCreateForm = function(){
        $scope.mode = 'create';
        $scope.object = {

        };
        $('#objectForm').modal('show');
    }
    $scope.showEditForm = function(object){
        $scope.mode = 'edit';
        $scope.object = angular.copy(object)
        $scope.object = $scope.buildObject(object);
        $('#objectForm').modal('show');
    }
    $scope.showDuplicateForm = function(object){
        $scope.mode = 'create';
        $scope.object = object
        $scope.object.id = null;
        $scope.object = $scope.buildObject($scope.object);
        $('#objectForm').modal('show');
    }
    $scope.changeObjectCategories = function () {
        console.log($scope.selected)
        $scope.object.categories.push($scope.selected);
    }
    $scope.removeCategory = function(key) {
        $scope.object.categories.splice(key, 1);
    }
    $scope.buildObject = function(object){
        object = angular.copy(object);
        return object;
    }


    $scope.showDeleteForm = function(object){
        $scope.object = object;
        $scope.mode = 'delete';
        $('#deleteForm').modal('show');
    }
    $scope.options = options
      // Called when the editor is completely ready.
      $scope.onReady = function () {
        // ...
      };
      $scope.remove = function(key){
          console.log(key);
      }
    this.initialize();
}
