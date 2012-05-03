function init() {
	$("#form").submit(submit);
	$("#styles").loadSelect("styles").val("apa");
	$("#locales").loadSelect("locales").val("en-US");
}

$.fn.loadSelect = function(url) {
	var select = $(this);
	$.getAsync(url, function(data) {
		data.sort();
		var options = arrayToSelectOptions(data);
		select.html(options);
	});
	return select;
};

$.getAsync = function(url, success) {
	$.ajax({
		url : url,
		async : false,
		success: success
	});
};

function arrayToSelectOptions(array) {
	var options = $.map(array, function(elem) {
		return '<option value="' + elem + '">' + elem + '</option>';
	});
	return options.join("");
}

function submit() {
	var doi = $("#doi").val();
	$.ajax({
		url : "format",
		data : {
			doi : doi,
			style : $("#styles").val(),
			lang : $("#locales").val()
		},
		dataType : "text",
		success : function(data) {
			$("#citation").text(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR.responseText);
		}
	});
	return false;
}

$(document).ready(init);