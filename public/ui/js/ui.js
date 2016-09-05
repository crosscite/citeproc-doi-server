function init() {
	$("#form").submit(submit);
	$("#styles").loadSelect("styles").val("apa");
	$("#locales").loadSelect("locales").val("en-US");
	new Clipboard('.btn');
	$("#citation").hide();
	$("#copy_citation").hide();
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
	$("#citation").hide();
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
			$("#citation").show();
			$("#copy_citation").show();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$("#copy_citation").hide();
			alert(jqXHR.responseText);
		}
	});
	return false;
}

$(document).ready(init);
