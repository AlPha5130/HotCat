mw.loader.using(['site']).then(function () {
	i18n = {
		specialpage: "Special:上传文件",
		multiupload: "批量上传：",
		yes: "是",
		no: "否",
		sourcefiles: "源文件名：",
		uploadfiles: "上传文件",
		nofiles: "请选择要上传的文件。",
		nolicense: "请选择要适用的授权协议。",
		summary: "文件说明",
		license: "授权协议",
		uploading: "上传中……",
		uploaded: "已上传",
		failed: "上传失败",
		done: "上传结束",
		comment: "Multiupload"
	};
	if (mw.config.get("wgPageName") !== i18n.specialpage) return;
	$("#wpUploadFile").parent().parent().addClass("regularFileSelect");
	$("tr.regularFileSelect").before('<tr><td class="mw-label">' + i18n.multiupload + '</td><td class="mw-input"><label><input type="radio" name="multipleFiles" value="' + i18n.yes + '" /> ' + i18n.yes + '</label> &nbsp; <label><input type="radio" name="multipleFiles" value="' + i18n.no + '" checked="" /> ' + i18n.no + '</label></td></tr>');
	$("tr.regularFileSelect").after('<tr class="multipleFileSelect" style="display:none;"><td class="mw-label">' + i18n.sourcefiles + '</td><td class="mw-input"><input type="file" id="multiupload" multiple /></td></tr>');
	$("input[name='wpUpload']").addClass("regularFileSelect");
	$("#wpDestFile").parent().parent().addClass("regularFileSelect");
	$("#wpIgnoreWarning").parent().parent().addClass("regularFileSelect");
	$("span.mw-htmlform-submit-buttons").append('<input type="button" value="' + i18n.uploadfiles + '" class="multipleFileSelect" style="display:none;" id="multiFileSubmit" />');
	$("input[name='multipleFiles']").change(function () {
		if (this.value === i18n.yes) {
			$(".regularFileSelect").hide();
			$(".multipleFileSelect").show();
		}
		else {
			$(".regularFileSelect").show();
			$(".multipleFileSelect").hide();
		}
	});
	$("#multiFileSubmit").click(function () {
		files = $("#multiupload")[0].files;
		if (files.length === 0) {
			mw.notify( i18n.nofiles, { title: comment } );
			return false;
		}
		if ($("#wpLicense option:selected").val() === "") {
			mw.notify( i18n.nolicense, { title: comment } );
			return false;
		}
		summary = $("#wpUploadDescription").val();
		if (summary !== "") {
			summary = "== " + i18n.summary + " ==\n" + summary;
			comment = i18n.comment + " " + summary.substring(0, 20);
		} else {
			comment = i18n.comment;
		}
		license = "== " + i18n.license + " ==\n" + $("#wpLicense option:selected").prop("title");
		text = summary + "\n" + license;
		watch = "preferences";
		if ($("#wpWatchthis").is(":checked")) {
			watch = "watch";
		}
		else {
			watch = "nochange";
		}
		$("#firstHeading").text(i18n.uploading);
		$("#mw-content-text").html("<h3>" + i18n.uploaded + "</h3><ul></ul><div style='display:none;' id='multiUploadFailed'><h3>" + i18n.failed + "</h3><ul></ul></div>");
		var api = new mw.Api();
		(function directUpload(files) {
			var element = files.shift();
			api.upload(element, {
				filename: element.name,
				text: text,
				comment: comment,
				watchlist: watch,
				format: 'json'
			}).done(function (d) {
				if ('error' in d) {
					$("#multiUploadFailed ul").append('<li>' + element.name + '：' + d.error.info + '</li>');
					$("#multiUploadFailed").show();
				}
				else {
					$("#mw-content-text > ul").append('<li><a href="' + d.upload.imageinfo.descriptionurl + '" target="_blank">' + d.upload.filename + '</a></li>');
				}
				directUpload(files);
			}).fail(function (e) {
				$("#multiUploadFailed ul").append('<li>' + element.name + '：' + e.message + '</li>');
				directUpload(files);
			});
		})(files);
	});
});
