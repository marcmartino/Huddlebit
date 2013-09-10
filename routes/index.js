
/*
 * GET home page.
 */
var encryptPassword = function (pass) {
	return "poopberry";
};
var validateEmail = function (email) {
	return (email.length > 5 && email.indexOf(".") &&
		email.indexOf("@") > -1);
};
var getCurrentUserId = function (adminUserId) {
	return 1;
}

module.exports = function(app){	
	var scaffoldApi = require("./routesScaffold");
	var routesMakeup = [{
		noun: "email",
		required: ["email"],
		optional: ["ip", "browser"],
		validate: {email: {func: validateEmail,
			message: "invalid email"}}
	},{
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