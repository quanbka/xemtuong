system.controller("ProductController", ProductController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function ProductController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "ProductController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function () {
        $scope.filter = {};
        $scope.getAllCategories();
        $scope.getProducts();
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
        if(typeof $scope.object.slides == 'object') {
            $scope.object.slides = $scope.object.slides.join();
        }
        return $scope.object;
    }
    $scope.create = function(){
        $http({
            method : "post",
            url : "/api/product",
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getProducts();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }
    $scope.update = function(){
        $http({
            method : "put",
            url : "/api/product/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getProducts();
            $('#objectForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }
    $scope.delete = function(){
        $http({
            method : "delete",
            url : "/api/product/" + $scope.object.id,
            params : {
                api_token : api_token,
            },
            data : $scope.object
        }).then(function mysuccessful(response) {
            $scope.getProducts();
            $('#deleteForm').modal('hide');
        }, function myError(response) {
            alert("Phát sinh lỗi, vui lòng liên hệ đội kỹ thuật!");
        });
    }
    $scope.getAllCategories = function(){
        $scope.categories = [];
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
                $scope.categories[array[i].id] = array[i];
            }
        }, function myError(response) {
            $scope.categories = [];
        });
    }
    $scope.getProducts = function(){
        params = {
            api_token : api_token,
            page_size : 20,
            page: $scope.page_id,
            'categories^id': $scope.filter.category_id,
            order_by: '-id',
            with: 'categories',
            // 'name~dell' : '',
        };
        if ($scope.filter.name) {
            params['name~' + $scope.filter.name] = '';
        }
        $http({
            method : "GET",
            url : "/api/product",
            params : params
        }).then(function mysuccessful(response) {
            $scope.products = response.data.data.data;
            $scope.pagesCount = response.data.data.last_page;
        }, function myError(response) {
            $scope.products = [];
        });
    }
    $scope.showCreateForm = function(){
        $scope.mode = 'create';
        $scope.object = {
            'categories' : [],
            'slides' : [],
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
        console.log(object.slides);
        $scope.showSlide = false;
        object.slides = $scope.getSlides(object.slides);
        console.log(object.slides);
        // object.slides = (object.slides);
        // object.slides = (JSON.parse(object.slides))
        return object;
    }
    $scope.getSlides = function (slides) {
        var retval = [];
        if (slides && typeof(slides) == 'string') {
            retval = slides.split(",");
        }
        return retval;
    }
    $scope.addMoreSlide = function () {
        lfm({type: 'image'}, function(url, path) {
            console.log(path);
            $scope.object.slides.push(path);
        });
    }
    $scope.removeSlide = function (index) {
        $scope.object.slides.splice(index,1);
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
          console.log($scope.object.slides)
          $scope.object.slides.splice(key, 1)
          $scope.object.slides = $scope.object.slides;
          console.log(key);
      }
    this.initialize();
}
