$().ready(function () {
	$("#titleFormat").on("click", function () {
		$("#icalTitle").val($("#icalTitle").val() + "%s");
	});
});