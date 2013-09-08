var _ = require("../../vendor/scoreunder");
var uriStartPoint = "/api/";
var app;
var getObjectAttr = function (obj) {
	return function (returnObj, searchAttr) {
		var attrVal = obj[searchAttr];
		if (attrVal !== undefined && attrVal !== null) {
			returnObj[searchAttr] = attrVal;
		}
		return returnObj;
	};
}

var getOptionalAttrs = getAttrs = function (attrList, obj) {
	console.log("optional: ", attrList);
	return _.reduce(getObjectAttr(obj), {}, attrList);
}

var getRequiredAttrs = function (attrList, obj) {
	var foundAttrs = getAttrs(attrList, obj);
	console.log([attrList.length, "===", foundAttrs.length].join(" "));
	if (attrList.length === foundAttrs.length) {
		return foundAttrs;
	}
}
module.exports = function (app) {
	return _.compose(_.map(instantiateEndpoints(app)),
		_.map(genRestActions(app)), _.map(genRestUris));
};

var genRestUris = function (routeMakeup) {
	var restUris = {
		create: {
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/create",
			verb: "post"
		},
		read: {
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/:id",
			verb: "get"
		},
		update: {
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/:id",
			verb: "put"
		},
		"delete": {
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/:id",
			verb: "del"
		},
	};
	return _.extend(routeMakeup, {"restData": restUris});
};
var modelName = function (lowerCaseName) {
	return lowerCaseName[0].toUpperCase() + lowerCaseName.substr(1);
}

var modifyBody = function (modList, attrObj) {
	modifiedAttrs = _.reduce((function (obj) {
		return function (returnObj, modFunc, attrName) {
			returnObj[attrName] = modFunc(obj[attrName]);
			return returnObj;
		};
	}(attrObj)), {}, modList);
	//extend should overwrite attrobj attributes with the ones from
	//mod if they have the same key
	return _.extend(attrObj, modifiedAttrs);
};

var validateBody = function (validateList, attrObj) {
	//getting tired, modify body and validate body could probably be refactored
	modifiedAttrs = _.reduce((function (obj) {
		return function (returnObj, modObj, attrName) {
			var validatedObj = modObj.func(obj[attrName]);
			// console.log([modObj, obj[attrName], validatedObj].join(" "));
			if (!validatedObj) {
				delete returnObj[attrName];
			}
			return returnObj;
		};
	}(attrObj)), attrObj, validateList);
	console.log(modifiedAttrs);
	return modifiedAttrs;
}

var addCreateFunction = function (routeMakeup, app) {
	return function (req, res) {
		var requestBody = req.body,
			modifiedBody = modifyBody(routeMakeup.modify, requestBody);
			console.log("validate");
			console.log(routeMakeup.validate);
			console.log(modifiedBody);
		var validatedBody = validateBody(routeMakeup.validate, modifiedBody),
			requiredAttrs = getRequiredAttrs(routeMakeup.required, validatedBody),
			optionalAttrs = getOptionalAttrs(routeMakeup.optional, validatedBody),
			finalAttrs;
		if (requiredAttrs) {
			finalAttrs = _.extend(optionalAttrs, requiredAttrs);
			app.get("models")[modelName(routeMakeup.noun)].build(finalAttrs)
				.save().success(function (newItem) {
					app.get("sendSuccess")({id: 1, idTest: newItem.id});
				}).error(function (err) {
					console.log(err);
					app.get("sendError")("error saving see console for more info", res);
				});
		} else {
			app.get("sendError")("required attributes not supplied", res);
		}
	}
}

var placeholderAction = function (app) {
	return function (req, res) {
		app.get("sendError")("this action has not been defined yet!", res);
	};
};

var genRestActions = function (app) {
	return function (routeMakeup) {
		routeMakeup.restData.create.func 		= addCreateFunction(routeMakeup, app);
		routeMakeup.restData.read.func 			= placeholderAction(app);
		routeMakeup.restData.update.func 		= placeholderAction(app);
		routeMakeup.restData['delete'].func = placeholderAction(app);

		return routeMakeup;
	};
};//_.compose(addCreateFunction, addReadFunction,
	//addUpdateFunction, addDeleteFunction);

var instantiateEndpoints = function (app) {
	return function (routeMakeup) {
		_.forEach(function (verbData, verb) {
			console.log(
				[verbData.verb, verbData.uri, verbData.func.length].join(" "));
			app[verbData.verb](verbData.uri, verbData.func);
			console.log([routeMakeup.noun, verb, "instantiated"].join(" "));
		}, routeMakeup.restData);
		return routeMakeup;
	};
};