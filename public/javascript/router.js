define(['davis', 'scoreunder'], function () {
	
		console.log("running route fun");

		var routeTransforms = {
			"/home": "home",
			"/terms": "tos"},
			app;

			var app = Davis(function () {
          this.get('/welcome/:name', function (req) {
            alert("Hello " + req.params['name'])
          })
        });
			app.start();
			/*Davis(function () {
				this.configure(function () {
					this.generateRequestOnPageLoad = true;
				});*/

				// this.get(appSubdirectory + "/", renderDefaultView("splash"));
				/*this.get("/:name", function (req) {
					console.log("Hello " + req.params['name']);
				});
		});*/

		return app;


		/*var genRoute = function (jsFile) {
			return function () {
				require(['modules/'], function (route) {
					console.log(router.start());
				});
			};
		},
		routes = _.reduce(
			function (result, jsFileName, key) {
				result[key] = genRoute(jsFileName);
				return result;
			}, {},
			{"/home": "home",
			"/terms": "tos"});
		console.log(routes);
		var router = Router(routes);
		router.configure({
			html5history: true,
			run_handler_in_init: false
		})
		router.init();*/



});
