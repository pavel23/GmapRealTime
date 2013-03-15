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

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Cargando GoogleMaps en tiempo real en el puerto " + app.get('port'));
});

var io = require('socket.io').listen(server);
var obj_locations = {};

io.sockets.on('connection', function (socket) { 
	var user_id = socket.id;
	socket.on('add:locations', function(location){
		location.user_id = user_id;
		obj_locations[user_id] =  location;
		socket.emit('user:locations', user_id);
		socket.broadcast.emit('update:locations', obj_locations);
	});

	socket.on('disconnect', function(){
		delete obj_locations[user_id];
		socket.broadcast.emit('update:locations', obj_locations);
	});
});