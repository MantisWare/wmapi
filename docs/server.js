var connect = require('connect');
var serveStatic = require('serve-static');


var path = __dirname + '/3.x.x/_book';
console.log('Document server starting: ' + path);

connect().use(serveStatic(path)).listen(8080, function(){
  console.log('\n\nServer running on 8080...');
});