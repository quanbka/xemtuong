tinymce.PluginManager.add('productLink', function (editor, url) {
    var self = this, valbox;
    editor.settings.myKeyValueList = [{text: "Chưa có dữ liệu", value: ""}];
    function getValues() {
        return editor.settings.myKeyValueList;
    }
// Add a button that opens a window
    editor.addButton('productLink', {
        text: 'Link sản phẩm',
        icon: false,
        onclick: function () {
            // Open window
            button = this;
            var win = editor.windowManager.open({
                title: 'Chọn sản phẩm',
                body: [
                    {
                        type: 'textbox',
                        name: 'search',
                        label: 'Tìm kiếm',
                    },
                    {
                        type: 'listbox',
                        name: 'product',
                        label: 'Sản phẩm',
                        values: getValues(),
                    }
                ],
                onkeyup: function (e) {
                    // Insert content when the window form is submitted
                    search = win.find("#search")[0];
                    $.ajax({
                        url: "/system/product/find",
                        type: "post",
                        dataType: "json",
                        data: {
                            keyword: $("#" + search._id).val(),
                        },
                        error: function () {
                        },
                        beforeSend: function () {
                            // do smth before sending
                        },
                        complete: function () {
                            // do smth when complete action
                        },
                        successful: function (data) {
                            if (data.status == "successful") {
                                var list = [];
                                data.products.forEach(function (product) {
                                    if (product.title != null) {
                                        list.push({text: product.title, value: '<a href="/' + product.slug + '" data-link="product" data-code="' + product.code + '">' + product.title + '</a>'});
                                    }
                                });
                                if (list.length <= 0) {
                                    list = [{text: "Không tìm thấy", value: ""}];
                                }
                            } else {
                                list = [{text: "Không tìm thấy", value: ""}];
                            }
                            tinyMCE.activeEditor.settings.myKeyValueList = list;
                            tinyMCE.activeEditor.plugins.productLink.refresh();
                        }
                    });

                },
                onsubmit: function (e) {
                    editor.insertContent(e.data.product);
                }
            });
            valbox = win.find("#product")[0];
        }
    });
    self.refresh = function () {
        valbox.value(null);
        valbox.menu = null;
        valbox.value(getValues()[0].value);
        valbox.settings.text = getValues()[0].text;
        valbox.settings.values = valbox.settings.menu = getValues();

    };
});