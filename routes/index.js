
/*
 * GET home page.
 */
var encryptPassword = function (pass) {
	return "poopberry";
};
var validateEmail = function (email) {
	if (email.indexOf("@") > -1) {
		return true;
	}
};
var getCurrentUserId = function (adminUserId) {
	return 1;
}

module.exports = function(app){	
	var scaffoldApi = require("./routesScaffold");
	var routesMakeup = [{
		noun: "user",
		required: ["email", "password"],
		optional: ["name", "description"],
		hidden: ["password"],
		validate: {email: {func: validateEmail,
			message: "invalid email"}},
		modify: {password: encryptPassword}
	},{
		noun: "startup",
		required: ["name", "url", "adminUserId"],
		optional: ["email", "tagline", "imageUrl", "description"],
		validate: {email: {func: validateEmail,
			message: "invalid email"}},
		modify: {adminUserId: getCurrentUserId}
	}];
  scaffoldApi(app)(routesMakeup);
};