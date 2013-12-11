require.config({
	deps: [""],
	paths: {
		"jquery": "/vendor/javascript/jquery-2.0.3",
		"scoreunder": "/vendor/javascript/scoreunder",
		"director": "/vendor/javascript/director"
	}
});

require(['modules/home'], function (template) {
	template.showName("Jack");
});