var express = require('express'), 
	routes  = require('./routes'), 
	http    = require('http'), 
	path    = require('path'), 
	cons    = require('consolidate');

var app = express();

app.set('port', process.env.PORT || 3000);
app.engine('.html', cons.jade);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use( express.bodyParser() );
app.use( express.cookieParser() );
app.use(app.router);

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Cargando GoogleMaps en tiempo real en el puerto " + app.get('port'));
});

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
		console.log(socket.id);
	});

});