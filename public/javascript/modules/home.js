define(['scoreunder', 'jquery'], function () {
	var showName = function (n) {
		var temp = _.template("Hello <%= name %>");
		$("body").html(temp({name: n}));
	};
	return {
		showName: showName,
		start: function () {
			return "home mod";
		}
	}
});