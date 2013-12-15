require.config({
	deps: [""],
	paths: {
		"jquery": "/vendor/javascript/jquery-2.0.3",
		"scoreunder": "/vendor/javascript/scoreunder",
		"director": "/vendor/javascript/director",
		"davis": "/vendor/javascript/davis"
	}
});

require(['router'], function (router) {
	console.log("router loaded");
	console.log(router);
	// router.start();
});
/*require(['modules/home'], function (template) {
	console.log("home mod loaded");
});*/