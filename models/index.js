/*
mysql -h huddlebit-db.cgo9knjezv3t.us-west-2.rds.amazonaws.com -P 3306 -u marc -p huddlebit
*/
var _ = require("../vendor/scoreunder");
var dbConf = require("../config/db.json");
// console.log(dbConf);
var Sequelize = require("sequelize-mysql").sequelize,
	sequelize = new Sequelize(dbConf.database, dbConf.user, dbConf.pass, {
		dialect: 'mysql',
		host: dbConf.host,
		port: dbConf.port
	}),
	standardModels = require('./seqInit')(Sequelize, sequelize);
standardModels.Seq = Sequelize;
standardModels.seq = sequelize;
standardModels.getInString = function (inArray) {
	return "(\'" + inArray.join("','") + "\')"
};
standardModels.mapDataValues = function (element) {
	return element.dataValues;
}
standardModels.dbSync = function (mods) {
	var filteredModels = _.reduce(function (result, mod, key) {
		if (key[0].toUpperCase() === key[0] && key !== "Seq") {
			var newEle = {};
			newEle[key] = mod;
			return _.extend(result, newEle); 
		}
		return result;
	}, {}, mods);
	// var models = require("./models/seqInit.js");
	
	_.map(function (model) {
		model.sync().on('success', function () {

			})
			.on('failure', function (error) {
				console.log("failed to sync table");
				console.log(error);
			})
	})(filteredModels);	
	// console.log(filteredModels);
	return Object.keys(filteredModels);
};
module.exports = standardModels;