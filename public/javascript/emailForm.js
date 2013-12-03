$(function () {

	$("form#emailForm").on("submit", function (e) {
		e.preventDefault();
		var email = $(this).find("input[type=text]").val();
		var ua = window.navigator.userAgent;
		$.ajax({
			url: "/api/email/",
			type: "POST",
			data: {
				email: email,
				browser: ua
			},
			success: ajaxSuccess(function () {alertMessage.setSuccessMessage("Thank you for you interest. You should be hearing from the Huddlebit team soon!")}, thereHasBeenAnError),
			error: thereHasBeenAnError
		});

	});
});

function thereHasBeenAnError() {
	alertMessage.setErrorMessage("There has been an error. Please try again or contact a system administrator.", 10000);
}

function ajaxSuccess(successFunction, errorFunction) {
//generic function for handling ajax returns in the pattern of
//{status: "success" || "failure", "message": data}
	return function (data) {
		var parsedJson, success = false,
		ajaxData;
		try {
			ajaxData = (data.responseText || data);
			if (typeof ajaxData === "string") {
				parsedJson = JSON.parse(data.responseText || data);
			} else if (typeof ajaxData === "object") {
				parsedJson = ajaxData;
			}
			if (parsedJson.status && parsedJson.status === "success") {
				success = true;
				//successFunction (parsedJson.message);
			} else {
				console.warn("request error: " + parsedJson.message);
				//errorFunction (parsedJson);
			}
		} catch (exceptObject) {
			console.warn("returned invalid json");
			console.log(data);
			console.error(exceptObject);
		}
		if (success) {
			successFunction(parsedJson.message);
		} else {
			(errorFunction || console.warn)(parsedJson.message);
		}
	};
}