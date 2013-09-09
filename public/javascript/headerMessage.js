var alertMessage = (function () {
	function clearFunction(func) {
		return func || function () {};
	} 
	return {
		// start: function () {
		// 	console.log(alertMessages);
		// 	$("div.headerContainer").on("click", "div.headerContainerRight", this.changeProfilePic);
		// },

		clear: function (callback){
			$(".alertMessages:visible").fadeOut("fast", clearFunction(callback));
		},
		setMessage: function (messageType, text, timing, callback) {
			console.log("." + messageType.toLowerCase() + "_message");
			var thisMessageRef = $("." + messageType.toLowerCase() + "_message"), timeoutFunc, callbackWithTimer;
			if (timing) {
				timeoutFunc = (function (messageRef){
					return function (){
						messageRef.fadeOut("fast");
					};
				}(thisMessageRef));
				callbackWithTimer = (function (callback, timeoutFunc, time) {
					return function () {
						window.setTimeout(timeoutFunc, timing);
						clearFunction(callback)();
					}
				}(callback, timeoutFunc, timing));	
			}
			thisMessageRef.text(text).fadeIn("fast", callbackWithTimer || clearFunction(callback));
		},
		setErrorMessage: function (text, timing, callback) {
			this.setMessage("error", text, timing, callback);
		},
		setRegularMessage: function (text, timing, callback) {
			this.setMessage("regular", text, timing, callback);
		},
		setSuccessMessage: function (text, timing, callback) {
			this.setMessage("success", text, timing, callback);
		},
		startLoading: function (callback) {
			this.setMessage("regular","Loading..", undefined, callback);
		},
		stopLoading: function (callback) {
			$(".alertMessages.regular_message:visible").fadeOut("fast", clearFunction(callback));
		},
		changeProfilePic: function () {
			alert("test");
		}
	};
}());