system.controller("BlogController", BlogController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function BlogController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "BlogController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function () {
        $scope.filter = {};
        $scope.getAllCategories();
        $scope.getBlogs();
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
            url : "/api/blog",
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getBlogs();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }

    $scope.update = function(){
        $http({
            method : "put",
            url : "/api/blog/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getBlogs();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }

    $scope.getAllCategories = function(){
        $scope.categories = [];
        $http({
            method : "GET",
            url : "/api/post-category",
            params : {
                api_token : api_token,
                page_size : 0,
            }
        }).then(function mysuccessful(response) {
            array = response.data.data.data;
            for (var i = 0; i < array.length; i++) {
                // console.log(array[i])
                $scope.categories[array[i].id] = array[i];
            }

            // console.log($scope.categories);
        }, function myError(response) {
            $scope.categories = [];
            // console.log($scope.categories);
        });
    }

    $scope.getBlogs = function(){
        $http({
            method : "GET",
            url : "/api/blog",
            params : {
                api_token : api_token,
                page_size : 20,
                page: $scope.page_id,
                category_id: $scope.filter.category_id,
                order_by: '-id'
            }
        }).then(function mysuccessful(response) {
            $scope.blogs = response.data.data.data;
            $scope.pagesCount = response.data.data.last_page;
        }, function myError(response) {
            $scope.blogs = [];
        });
    }

    $scope.showCreateForm = function(){
        $scope.mode = 'create';
        $scope.object = {};
        $('#objectForm').modal('show');
    }

    $scope.showEditForm = function(object){
        $scope.mode = 'edit';
        $scope.object = object
        $scope.object = $scope.buildObject($scope.object);
        $('#objectForm').modal('show');
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
