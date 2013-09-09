
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'),
  // bookshelf = require("./bookshelf/");
  models = require("./models/"),
  routes = require("./routes/"),
  _ = require("./vendor/scoreunder"),
  hbs = require('hbs');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set("models", models);

hbs.registerPartials(__dirname + '/views/partials');

app.set("sendSuccess", returnMessage("success"));
app.set("sendError", returnMessage("error"));
function returnMessage(status) {
	return function (data, res) {
		var returnObj = {status: status, message: data};
		if (res) {
			res.json(returnObj);
		}
		return JSON.stringify(returnObj);
	};
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.set('port', process.env.PORT || 3000);
}

app.get('/signup', function (req, res) {
  res.render('email', {});
});
app.get('/users', user.list);
app.get('/dbsync', function (req, res) {
  res.send("attempted to set " + models.dbSync(models) +
    ". Check the console for further information");
});
routes(app);
app.get('/', function (req, res){
  // res.render('index', { title: 'Huddlebit fuck yeah!' });
  res.redirect('/signup');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
