var _ = require("../../vendor/scoreunder");
var uriStartPoint = "api/";
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
	if (attrList.length === foundAttrs.length) {
		return foundAttrs;
	}
}
module.exports = _.compose(_.map(instansiateEndpoints),
		_.map(genRestActions), _.map(genRestUris));

var genRestUris = function (routeMakeup) {
	var restUris = {
		create: {
			uri: uriStartPoint + routeMakeup.noun.toLowerCase() + "/",
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
	}
	return _.extend(routeMakeup, {"restData": restUris});
};
var modelName = function (lowerCaseName) {
	return lowerCaseName[0].toUpperCase() + lowerCaseName.substr(1);
}

var modifyBody = function (modObj, attrObj) {
	modifiedAttrs = _.reduce((function (obj) {
		return function (returnObj, modFunc, attrName) {
			returnObj[attrName] = modFunc(obj[attrName]);
			return returnObj;
		};
	}(attrObj)), {}, modObj);
	//extend should overwrite attrobj attributes with the ones from
	//mod if they have the same key
	return _.extend(attrObj, modifiedAttrs);
};

var validateBody = function (validateObj, attrObj) {
	//getting tired, modify body and validate body could probably be refactored
	modifiedAttrs = _.reduce((function (obj) {
		return function (returnObj, modFunc, attrName) {
			var validatedObj = modFunc(obj[attrName]);
			if (!validatedObj) {
				delete returnObj[attrName];
			}
			return returnObj;
		};
	}(attrObj)), attrObj, modObj);
	return modifiedAttrs;
}

var addCreateFunction = function (routeMakeup) {
	return function (req, res) {
		var requestBody = req.body,
			modifiedBody = modifyBody(routeMakeup.modify, requestBody),
			validatedBody = validateBody(routeMakeup.validate, modifiedBody),
			requiredAttrs = getRequiredAttrs(routeMakeup.required, validatedBody),
			optionalAttrs = getOptionalAttrs(routeMakeup.optional, validatedBody),
			finalAttrs;
		if (requiredAttrs) {
			finalAttrs = _.extend(requiredAttrs, optionalAttrs);
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

var genRestActions = _.compose(addCreateFunction, addReadFunction,
	addUpdateFunction, addDeleteFunction);