$(function () {

	$("form#emailForm").on("submit", function (e) {
		e.preventDefault();
		var email = $(this).find("input[type=text]").val();
		var ua = window.navigator.userAgent;
		$.ajax({
			url: "/api/email/create",
			type: "POST",
			data: {
				email: email,
				browser: ua
			},
			success: console.log,
			error: console.log
		})

	});
});