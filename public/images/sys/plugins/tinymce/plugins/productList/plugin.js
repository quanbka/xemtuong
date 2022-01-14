
tinymce.PluginManager.add('productList', function (editor, url) {
    var self = this, button, selectedProducts;
    editor.settings.listProducts = [{text: 'Chưa có dữ liệu', value:''}];
    editor.settings.listSeletedProduct = [{type: 'label', text: ''}];
    tinyMCE.DOM.loadCSS(url + '/css/productlist.min.css');
    function getValues(){
        return editor.settings.listProducts;
    }

    function getListSelected(){
        return editor.settings.listSeletedProduct;
    }

    //Reload listbox
    self.refresh = function () {
        button.value(null);
        button.menu = null;
        // button.value(getValues()[0].value);
        // button.settings.text = getValues()[0].text;
        button.settings.values = button.settings.menu = getValues();
    };

    self.refreshSelectedProducts = function(){
        // selectedProducts.remove();
        // selectedProducts.add(getListSelected()).reflow();
        // selectedProducts.append(getListSelected()).reflow();
    };

    // Add a button that opens a window
    editor.addButton('productList', {
        text: 'Insert Products',
        icon: false,
        onclick: function () {
            // Open window
            var window = editor.windowManager.open({
                title: 'Nhập danh sách sản phẩm',
                width: 800,
                height: 240,
                buttons: [{
                    text: 'Thêm vào nội dung',
                    classes: 'widget btn primary first abs-layout-item',
                    id: 'uniqueid',
                    disabled: false,
                    onclick: 'submit'
                }, {
                    text: 'Hủy',
                    onclick: 'close'
                }],
                body: [
                    {
                        type: 'textbox',
                        name: 'title',
                        tooltip: 'Nhập tên sản phẩm để tìm',
                        autofocus: true
                    },
                    {
                        type: 'listbox',
                        name: 'listProducts',
                        multiline: true,
                        tooltip: 'Chọn sản phẩm trong danh sách',
                        values: getValues(),
                        onselect: function(e){
                            var productListSelected = window.find('#listProducts');
                            var selectedList = getListSelected();
                            var selectedValue = {
                                type: 'textbox',
                                text: productListSelected.text(),
                                value: productListSelected.value(),
                                classes: 'selected-text-box',
                                tooltip: productListSelected.text(),
                                onclick: function(){
                                    var items = tinyMCE.activeEditor.settings.listSeletedProduct;
                                    var newItems = [];
                                    for(var k = 0; k <= (items.length - 1); k++){
                                        if(items[k].value != this.settings.value){
                                            newItems.push(items[k]);
                                        }
                                    }
                                    tinyMCE.activeEditor.settings.listSeletedProduct = newItems;
                                    tinyMCE.activeEditor.plugins.productList.refreshSelectedProducts();
                                }
                            };
                            var isPushed = true;
                            for(var i = (selectedList.length - 1); i >= 0; i-- ){
                                if(selectedList[i].type == 'label'){
                                    selectedList.splice(i, 1);
                                }else if(selectedList[i].value == selectedValue.value){
                                    isPushed = false;
                                }
                            }
                            if(isPushed){
                                selectedList.push(selectedValue);
                                selectedProducts.append(selectedValue).reflow();
                            }
                            tinyMCE.activeEditor.settings.listSeletedProduct = selectedList;
                        }
                    },
                    {
                        type: 'container',
                        label: 'Sản phẩm',
                        name: 'selectedProducts',
                        minHeight: 106,
                        layout: 'flow',
                        items: getListSelected()
                    }
                ],
                onsubmit: function (e) {
                    var submitSelected = tinyMCE.activeEditor.settings.listSeletedProduct;
                    var slugs = '';
                    for(var j = 0; j <= (submitSelected.length - 1); j++){

                        slugs += submitSelected[j].value +',';
                    }
                    slugs = slugs.slice(0, -1);
                    editor.insertContent('[products slugs="' + slugs +'"/]');
                },
                onclose: function (e) {
                    tinyMCE.activeEditor.settings.listSeletedProduct = [{type: 'label', text: ''}];
                    tinyMCE.activeEditor.settings.listProducts = [{text: 'Chưa có dữ liệu', value:''}];
                    selectedProducts.remove();
                    button.remove();
                    editor.windowManager.close();
                },
                onkeyup: function(e){
                    var searchTitle = window.find('#title')[0];
                    var searchValue = $("#" + searchTitle._id).val();
                    var list = [];
                    if(searchValue == ''){
                        list = [{text: 'Chưa có dữ liệu', value:''}];
                    }else{
                        $.ajax({
                            url: "/system/product/find",
                            type: "post",
                            dataType: "json",
                            data: {
                                keyword: searchValue,
                            },
                            error: function () {},
                            beforeSend: function () {},
                            complete: function () {},
                            successful: function(data){
                                if (data.status == "successful") {
                                    data.products.forEach(function (product) {
                                        if (product.title != null) {
                                            list.push({text: product.title, value: product.slug });
                                        }
                                    });
                                    if (list.length <= 0) {
                                        list = [{text: "Không tìm thấy", value: ""}];
                                    }
                                } else {
                                    list = [{text: "Không tìm thấy", value: ""}];
                                }
                                tinyMCE.activeEditor.settings.listProducts = list;
                                tinyMCE.activeEditor.plugins.productList.refresh();
                            }
                        });
                    }
                }
            });
            button = window.find("#listProducts")[0];
            selectedProducts = window.find('#selectedProducts')[0];
        }
    });

    // return {
    //     getMetadata: function () {
    //         return {
    //             title: "Example plugin",
    //             url: "http://exampleplugindocsurl.com"
    //         };
    //     }
    // };
});
