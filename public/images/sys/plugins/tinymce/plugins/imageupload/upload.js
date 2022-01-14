var ImageUpload = {
	inProgress : function() {
		document.getElementById("upload_form").innerHTML = '<br><p>Uploading Image...</p>';
	},
	uploadsuccessful : function(result) {
		document.getElementById("image_preview").style.display = 'block';
		document.getElementById("upload_form").innerHTML = '<br><p>Upload successful!</p>';
		parent.tinymce.EditorManager.activeEditor.insertContent('<img src="' + result.code +'">');
	}

};