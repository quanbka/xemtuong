system.controller("CollectionController", CollectionController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function CollectionController($scope, $http, $rootScope, $timeout) {
    $scope.controllerName = "CollectionController";
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    $scope.filter = {
        pageId: 0
    };
    $scope.collections = [];
    $scope.collection = {
      name: '',
      slug: '',
      description: '',
      show_deal: true,
      show_store: true,
      status: '',
      store: '',
      store_id: [],
    };
    $scope.formErrors = {};
    $scope.collectionStore = [];
    $scope.mode = 'list';
    $scope.pageSize = 40;
    $scope.resetFilter = function () {
        $scope.filter = {
            status: $scope.statuses[0],
            pageId: 0
        }
    };
    $scope.statuses = [
      {code: '', value: 'Please select status'},
      {code: 'pending', value: 'Pending'},
      {code: 'active', value: 'Active'}
    ];
    $scope.stores = [];

    this.initialize = function () {
        api_domain = '';
        $scope.resetFilter();
        $scope.find();
    };

    $scope.find = function () {
        url = api_domain + "/api/collection";
        $('#searchOrder').button('loading');
        var filter = buildFilter();
        $http.get(url, {params: filter}).successful(function (response) {
            if (response.status != null && response.status == 'successful') {
                $scope.collections = response.data;
                $scope.pagesCount = response.paginator.page_count;
            }
            $('#searchOrder').button('reset');
        });

    };

    $scope.selectStore = function (store){
        var obj = {
            collection_id: $scope.collection.id,
            s_name: store.name,
            id: store.id,
            store_id: store.id
          };
        var isPush = false;
        var selectedStore = $scope.collectionStore;
        if(selectedStore.length <= 0){
          isPush = true;
        }
        for(var i = 0; i < selectedStore.length; i++){
          if(obj.store_id != selectedStore[i].store_id){
            isPush = true;
          }else{
            isPush = false;
          }
        }
        if(isPush){
          selectedStore.push(obj);
        }
        $scope.collectionStore = selectedStore;
        $scope.collection.store = '';
        if($scope.collection.store_id.length < selectedStore.length){
          selectedStore.forEach(function(item){
            if($scope.collection.store_id.indexOf(item.store_id) == -1){
                $scope.collection.store_id.push(item.store_id);
            }
          });
        }
        $scope.stores = {};
    };

    $scope.removeStore = function(store){
      var selectedStore = $scope.collectionStore;
      var rebuildStore = [];
      for(var i = 0; i < selectedStore.length; i++){
        if(selectedStore[i].store_id == store.store_id){
          continue;
        }else{
          rebuildStore.push(selectedStore[i]);
        }
      }
      $scope.collectionStore = rebuildStore;
      if($scope.collection.store_id.length >= rebuildStore.length){
        rebuildStore.forEach(function(item){
          if($scope.collection.store_id.indexOf(item.id) == -1){
              $scope.collection.store_id.push(item.id);
          }
        });
      }
    };

    function buildFilter() {
        var filter = {
            api_token,
            page_id: $scope.filter.pageId + 1,
            page_size: $scope.pageSize
        };
        if ($scope.filter.create_from != null) {
            filter.create_from = $scope.filter.create_from;
        }
        if ($scope.filter.create_to != null) {
            filter.create_to = $scope.filter.create_to;
        }
        return filter;
    }

    $scope.reset = function () {
        $scope.resetFilter();
    };

    $scope.resetForm = function(){
        $scope.collection = {
          name: '',
          slug: '',
          description: '',
          show_deal: true,
          show_store: true,
          status: '',
          store: '',
          store_id: [],
        };
        $scope.collectionStore = [];
        $scope.mode = 'list';
    };

    $scope.edit = function (collection) {
        var status = {};
        var url    = api_domain + '/api/collection/' + collection.id;
        $scope.collection = angular.copy(collection);
        if(collection.show_store == 'show'){
          $scope.collection.show_store = true;
        }else{
          $scope.collection.show_store = false;
        }
        if(collection.show_deal == 'show'){
          $scope.collection.show_deal = true;
        }else{
          $scope.collection.show_deal = false;
        }
        for(var i = 0; i < $scope.statuses.length; i++){
          if(collection.status == $scope.statuses[i].code){
            status = $scope.statuses[i];
          }
        }
        $scope.collection.store_id = [];
        $scope.collection.status = status;
        $http.get(url, {params: {api_token}}).successful(function(response){
            if(response.status == 'successful'){
                $scope.mode = 'update';
                var store = response.data.storesObj;
                $scope.collectionStore = store;
            }
        });
        $('#collectionForm').modal('show');
    };

    $scope.delete = function (order) {
        var comfirm = confirm("Bạn có chắc chắn muốn xóa collection");
        var url = api_domain + "/api/collection/" + order.id;
        $http.delete(url, {
            params: {api_token}
        }).successful(function (reponse) {
            $scope.find();
        });
    }

    $scope.showCreateCollectionForm = function(){
      $scope.isSlugFocus = false;
      $scope.mode = 'create';
      $scope.collection.status = $scope.statuses[0];
      $('#collectionForm').modal('show');
    }

    $scope.createCollection = function () {
        var collection = buildCollection();
        var formErrors = validateCollection(collection);
        var url = api_domain + "/api/collection";
        if(typeof formErrors != 'undefined'){
          $scope.formErrors = formErrors;
          return false;
        }
        $scope.formErrors = {};
        $http({
            url: url,
            method: "POST",
            header: {
                'Content-Type': 'application/json',
            },
            params: {
                api_token,
            },
            data: collection

        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    showMessage('Created deal', 'The collection has been created!', 'successful');
                    $('#createCollectionButton').button('reset');
                    $('#collectionForm').modal('hide');
                    $scope.resetForm();
                    $scope.find();
                } else {
                    $scope.formErrors.message = response.data.message;
                }
            },
            function error(response){
                $('#createDealButton').button('reset');
                showMessage('Can not created!', 'Please contact technical team for support!', 'error');

            }
        );
    };

    $scope.updateCollection = function(){
      var collection = buildCollection();
      $('#updateCollectionButton').button('loading');
      url = api_domain + "/api/collection/" + $scope.collection.id;
      $http({
          url: url,
          method: "PUT",
          header: {
              'Content-Type': 'application/json',
          },
          params: {
              api_token,
          },
          data: collection
      }).then(
          function(response){
              $('#updateCollectionButton').button('reset');
              if (response.data.status == 'successful') {
                  showMessage('successful', 'The collection has been updated', 'successful');
                  $('#collectionForm').modal('hide');
                  $scope.resetForm();
                  $scope.find();
              } else {
                  showMessage(response.data.status, response.data.title, response.data.status);
              }
          },
          function error(response){
              $('#updateCollectionButton').button('reset');
              showMessage('Can not send request!', 'Please contact technical team for support!', 'error');

          }
      );
    };

    $scope.findStore = function(){
      var strFind = $scope.collection.store;
      url = api_domain + "/api/store";
      $('#searchStoreButton').button('loading');
      if(strFind != ''){
        $http({
            url: url,
            method: "GET",
            params: {
                api_token,
                name: strFind,
                page : 1,
                page_size : 15,
                with_user : true,
            },
            header: {
                'Content-Type': 'application/json',
            },
        }).then(
            function(response){
                $scope.stores = response.data.data;
                $('#searchStoreButton').button('reset');
            }
        );
      }else{
        $scope.stores = [];
      }
    };

    function buildCollection(){
      var retval = {};
      for(var key in $scope.collection){
        if((key == 'show_deal' && $scope.collection[key]) || (key == 'show_store' && $scope.collection[key]) ){
          retval[key] = 'show';
        }else{
          retval[key] = 'hide';
        }
        if(typeof $scope.collection[key] == 'object' && key == 'status'){
            retval[key] = $scope.collection[key].code;
        }else{
            retval[key] = $scope.collection[key];
        }
      }
      return retval;
    }

    function validateCollection(collection){
      for(var key in collection){
        if(key == 'show_deal' || key == 'show_store' || key == 'store'){
          continue;
        }
        if(typeof collection[key] != 'undefined' && collection[key] == ""){
          var field = key.charAt(0).toUpperCase() + key.slice(1);
          return {message: field + ' not empty. Please check again!', field: key};
        }
      }
    }

    this.initialize();

}
