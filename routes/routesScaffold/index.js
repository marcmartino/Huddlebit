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
	
	return _.reduce(getObjectAttr(obj), {}, attrList);
}

var getRequiredAttrs = function (attrList, obj) {
	var foundAttrs = getAttrs(attrList, obj);
	if (attrList.length === Object.keys(foundAttrs).length) {
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
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/:id?",
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
			
			if (!validatedObj) {
				delete returnObj[attrName];
			}
			return returnObj;
		};
	}(attrObj)), attrObj, validateList);
	return modifiedAttrs;
}

var addCreateFunction = function (routeMakeup, app) {
	return function (req, res) {
		var requestBody = req.body,
			modifiedBody = modifyBody(routeMakeup.modify, requestBody);
		var validatedBody = validateBody(routeMakeup.validate, modifiedBody),
			requiredAttrs = getRequiredAttrs(routeMakeup.required, validatedBody),
			optionalAttrs = getOptionalAttrs(routeMakeup.optional, validatedBody),
			finalAttrs;
		if (requiredAttrs) {
			finalAttrs = _.extend(optionalAttrs, requiredAttrs);
			console.log("noun: " + modelName(routeMakeup.noun));
			app.get("models")[modelName(routeMakeup.noun)].build(finalAttrs)
				.save().success(function (newItem) {
					var newDataValues = newItem.dataValues;
					app.get("sendSuccess")({id: newDataValues.id}, res);
				}).error(function (err) {
					console.log(err);
					app.get("sendError")("error saving see console for more info", res);
				});
		} else {
			app.get("sendError")("required attributes not supplied", res);
		}
	}
}

var addDeleteFunction = function (routeMakeup, app) {
	return function (req, res) {
		var id = req.params.id;
		app.get("models")[modelName(routeMakeup.noun)].find(id)
		.success(function (dbObj) {
			if (dbObj == null || dbObj.dataValues == null) {
				app.get("sendError")("no object found", res);
			} else {
				dbObj.destroy().success(function () {
						app.get("sendSuccess")("resource destroyed", res);
					})
					.error(function (error) {
						app.get("sendError")("error destroying. see console", res);
						console.log(error);
					})
			}
		})
		.error(function (error) {
			app.get("sendError")("error getting " + routeMakeup.noun, res);
		});
	}
}

var addReadFunction = function (routeMakeup, app) {
	return function (req, res) {
		if (req.params.id) {
			getSingleRead(routeMakeup, app, req, res);
		} else {
			getManyRead(routeMakeup, app, req, res);
		}
	}
}

var getSingleRead = function (routeMakeup, app, req, res) {
	var id = req.params.id;
	app.get("models")[modelName(routeMakeup.noun)].find(id)
		.success(function (dbObj) {
			if (dbObj == null || dbObj.dataValues == null) {
				app.get("sendError")("no object found", res);
			} else {
				var returnableValues = _.reduce(
					takeOutHidden, dbObj.dataValues, routeMakeup.hidden);
				app.get("sendSuccess")(returnableValues, res);
			}
		})
		.error(function (error) {
			app.get("sendError")("error getting " + routeMakeup.noun, res);
		});
}

var getManyRead = function (routeMakeup, app, req, res) {
	var queryParams = req.query;
	app.get("models")[modelName(routeMakeup.noun)].findAll({where:
		queryParams})
		.success(function (dbObjs) {
			console.log(typeof dbObjs);
			if (dbObjs) {
				var objsData = _.map(app.get("models").mapDataValues, dbObjs);
				app.get("sendSuccess")(objsData, res);
			} else {
				app.get("sendError")("no data found", res);
			}
		})
		.error(function (error) {
			app.get("sendError")("problem connecting to db. see console log for more details");
			console.log(error);
		})
}


var takeOutHidden = function (reduceObj, val, key) {
	delete reduceObj[val];
	return reduceObj;
}

var placeholderAction = function (app) {
	return function (req, res) {
		app.get("sendError")("this action has not been defined yet!", res);
	};
};

var genRestActions = function (app) {
	return function (routeMakeup) {
		routeMakeup.restData.create.func 		= addCreateFunction(routeMakeup, app);
		routeMakeup.restData.read.func 			= addReadFunction(routeMakeup, app);
		routeMakeup.restData.update.func 		= placeholderAction(app);
		routeMakeup.restData['delete'].func = addDeleteFunction(routeMakeup, app);

		return routeMakeup;
	};
};//_.compose(addCreateFunction, addReadFunction,
	//addUpdateFunction, addDeleteFunction);

var instantiateEndpoints = function (app) {
	return function (routeMakeup) {
		_.forEach(function (verbData, verb) {
			console.log(
				[verbData.verb, verbData.uri].join(" "));
			app[verbData.verb](verbData.uri, verbData.func);
			//console.log([routeMakeup.noun, verb, "instantiated"].join(" "));
		}, routeMakeup.restData);
		return routeMakeup;
	};
};