system.controller("ArticleController", ArticleController);
/**
 *
 * @param {type} $scope
 * @param {type} $http
 * @param {type} $rootScope
 * @returns {undefined}
 */
function ArticleController($scope, $http, $rootScope, $timeout, Upload) {
    $scope.controllerName = "ArticleController";
    $scope.pageId = 0;
    $scope.filter = {
        key: ""
    };
    $scope.editArticle = {};
    $scope.listCategory = listCategory;
    $scope.listStatus = [
        {value: 'enable', name: 'Enable'},
        {value: 'disable', name: 'Disable'}
    ];
    $scope.newArticle = {

    };
    $scope.baseController = this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.initialize = function(){
        $scope.find();
    }
    $scope.find = function(){
        $('#searchParamButton').button('loading');
        var param = {
            api_token: api_token,
            page_id: $scope.pageId + 1,

        };
        if ($scope.filter.search_article) {
            param.search_article = $scope.filter.search_article;
        }
        if ($scope.filter.status) {
            param.status = $scope.filter.status;
        }
        if ($scope.filter.category) {
            param.category = $scope.filter.category;
        }
        url = api_domain + "/api/article/index";
        $http({
            url: url,
            method: "GET",
            params: param,
            header: {
                'Content-Type': 'application/json',
            }
        }).then(
            function(response){
                if (response.data.status == 'successful') {
                    $scope.articles = response.data.data;
                    $scope.articles = getIntValOrder($scope.articles);
                    $scope.pageId = response.data.paginator.off_set / response.data.paginator.limit;
                    $scope.pagesCount = response.data.paginator.page_count;
                } else {
                    showMessage('Error', 'There was an error processing, please try again!', 'error');
                }
                $('#searchParamButton').button('reset');
            }
        );
    };

    function getIntValOrder(articles) {
        for (var index = 0; index < articles.length; ++index) {
            articles[index].order = parseInt(articles[index].order);
        }
        return articles;
    }

    $scope.showCreateArticleForm = function(){
        tinymce.remove();
        $scope.newArticle = {};
        $scope.newArticle.status = $scope.listStatus[0].value;
        $('#createArticleForm').modal('show');
        $scope.baseController.initTinymce("#articleContent", 400, 0);
    }

    $scope.reset = function () {
        $scope.filter = {
        }
        $scope.find();
    };
    
    $scope.createArticle = function () {
        if (!$scope.newArticle.title) {
            $('#newArticleTitle').focus();
            $('#newArticleTitle').css('border-color', 'red');
            return;
        } else {
            $('#newArticleTitle').css('border-color', '#d2d6de');
        }
        if (!$scope.newArticle.category_id) {
            $('#newArticleCategory').focus();
            $('#newArticleCategory').css('border-color', 'red');
            return;
        } else {
            $('#newArticleCategory').css('border-color', '#d2d6de');
        }
        if ($scope.newArticle.slug && hasWhiteSpace($scope.newArticle.slug)) {
            $('#newArticleSlug').focus();
            $('#newArticleSlug').css('border-color', 'red');
            return;
        } else {
            $('#newArticleSlug').css('border-color', '#d2d6de');
        }
        $('#createArticleButton').button('loading');
        var param = {
            api_token: api_token,
            title: $scope.newArticle.title,
            category_id: $scope.newArticle.category_id,
            description: $scope.newArticle.description,
            order: $scope.newArticle.order,
            meta_description: $scope.newArticle.meta_description,
            meta_title: $scope.newArticle.meta_title,
            meta_keywords: $scope.newArticle.meta_keywords,
            status: $scope.newArticle.status,
            content: tinyMCE.activeEditor.getContent(),
            slug: $scope.newArticle.slug
        };
        $http.post(api_domain + "/api/article/create", param).successful(function (data) {
            if (data.status == 'successful') {
                showMessage('successful!', 'Checkout successful!', 'successful');
                $('#createArticleForm').modal('hide');
                $scope.newArticle = {};
                $scope.find();
            } else {
                showMessage('Error', data.message, 'error');
            }
            $('#createArticleButton').button('reset');
        });
    }

    $scope.showEditArticle = function(article){
        tinymce.remove();
        $scope.editArticle = angular.copy(article);
        $('#editArticleForm').modal('show');
        setTimeout(function(){
            $scope.baseController.initTinymce("#editArticleContent", 400, 0);
        }, 200);

    }

    $scope.updateArticle = function () {
        if (!$scope.editArticle.title) {
            $('#editArticleTitle').focus();
            $('#editArticleTitle').css('border-color', 'red');
            return;
        } else {
            $('#editArticleTitle').css('border-color', '#d2d6de');
        }
        if (!$scope.editArticle.category_id) {
            $('#editArticleCategory').focus();
            $('#editArticleCategory').css('border-color', 'red');
            return;
        } else {
            $('#editArticleCategory').css('border-color', '#d2d6de');
        }
        if ($scope.editArticle.slug && hasWhiteSpace($scope.editArticle.slug)) {
            $('#editArticleSlug').focus();
            $('#editArticleSlug').css('border-color', 'red');
            return;
        } else {
            $('#editArticleSlug').css('border-color', '#d2d6de');
        }
        $('#updateArticleButton').button('loading');
        var param = {
            id: $scope.editArticle.id,
            api_token: api_token,
            title: $scope.editArticle.title,
            category_id: $scope.editArticle.category_id,
            description: $scope.editArticle.description,
            order: $scope.editArticle.order,
            meta_description: $scope.editArticle.meta_description,
            meta_title: $scope.editArticle.meta_title,
            meta_keywords: $scope.editArticle.meta_keywords,
            status: $scope.editArticle.status,
            content: tinyMCE.activeEditor.getContent(),
            slug: $scope.editArticle.slug
        };
        $http.post(api_domain + "/api/article/update", param).successful(function (data) {
            if (data.status == 'successful') {
                showMessage('successful!', 'Update successful!', 'successful');
                $('#editArticleForm').modal('hide');
                $scope.find();
            } else {
                showMessage('Error', data.message, 'error');
            }
            $('#updateArticleButton').button('reset');
        });
    }

    this.initialize();
    

    //fix enable input insert link, image in tinymce
    $(document).on('focusin', function(e) {
        if ($(e.target).closest(".mce-window").length || $(e.target).closest(".moxman-window").length) {
            e.stopImmediatePropagation();
        }
    });

    function hasWhiteSpace(string) {
        return string.indexOf(' ') >= 0;
    }

    $scope.deleteArticle = function (article) {
        if (!confirm("Are you sure delete this article: " + JSON.stringify(article.title))) {
            return;
        }
        $http.post(api_domain + "/api/article/delete", {id: article.id, api_token: api_token}).successful(function (data) {
            if (data.status != 'successful') {
                showMessage("Error", data.message, "error");
            } else {
                showMessage("successful", "Delete param successful!", "successful");
                $scope.find();
            }
        });
    };

    $scope.saveSortOrders = function (items) {
        var idSubmit = '#submit-order';
        $(idSubmit).button('loading');
        var param = {
            items: items,
            api_token: api_token
        };
        $http.post(api_domain + "/api/article/update-multi-order", param).successful(function (data) {
            if (data.status == 'successful') {
                showMessage('successful!', 'Update successful!', 'successful');
                $scope.find();
            } else {
                showMessage('Error', data.message, 'error');
            }
            $(idSubmit).button('reset');
        });
    }
}
