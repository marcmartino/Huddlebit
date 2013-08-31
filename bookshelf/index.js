var Bookshelf = require("bookshelf");
var myBS = Bookshelf.Initialize({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'root',
    password : 'testDBQWERTY',
    database : 'huddlebit',
    charset  : 'utf8'
  }
});
