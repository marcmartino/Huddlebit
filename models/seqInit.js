/*var Sequelize = require("sequelize-mysql").sequelize,
	sequelize = new Sequelize('udemia', 'root', 'testDBQWERTY', {
		dialect: 'mysql'
	});*/

module.exports = function (Sequelize, sequelize) {
	var models = {};

	models.Email = sequelize.define('Email', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		email: {type: Sequelize.STRING, allowNull: false},
		ip: Sequelize.STRING,
		browser: Sequelize.STRING
	});

	models.User = sequelize.define('User', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		name: {type: Sequelize.STRING, allowNull: false},
		email: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
		password: Sequelize.STRING,
		description: Sequelize.TEXT
	});

	models.Startup = sequelize.define('Startup', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		name: {type: Sequelize.STRING, allowNull: false},
		email: Sequelize.STRING,
		url: {type: Sequelize.STRING, allowNull: false},
		tagline: Sequelize.STRING,
		imageUrl: Sequelize.STRING,
		description: Sequelize.TEXT,
		adminUserId: {type: Sequelize.INTEGER, allowNull: false}
	});

	models.HelpRequest = sequelize.define('HelpRequest', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		startupId: {type: Sequelize.INTEGER, allowNull: false},
		name: Sequelize.STRING,
		title: Sequelize.STRING,
		description: Sequelize.TEXT
	});

	models.HelpRequestResponse = sequelize.define('HelpRequestResponse', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		userId: {type: Sequelize.INTEGER, allowNull: false},
		helpRequestId: {type: Sequelize.INTEGER, allowNull: false},
		status: {type: Sequelize.INTEGER, //was hoping to do an enumeration of pending, accepted, rejected but sequelize was being stupid
			defaultValue: 0 },

	});

	// models.HelpRequest = sequelize.define('', {
	// 	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	// 	name: Sequelize.STRING,
		
	// });
	
	

	return models;
}

function syncDb(db, models) {
	var _ = require("../vendor/scoreunder");
	_.map(function (model) {
		model.sync().on('success', function () {

			})
			.on('failure', function (error) {
				console.log("failed to sync table");
				console.log(error);
			})
	})(models);	
}