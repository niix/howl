
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , user    = require('./routes/user')
  , http    = require('http')
  , path    = require('path')
  , server  = require('http').createServer(app)
  , app     = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(httpServer);

var usernames = [];

// socket.io
io.sockets.on('connection', function (socket) {

  // client sends to chat
  socket.on('sendchat', function (data) {
    if (data) {
      io.sockets.emit('updatechat', socket.username, data);
    }
  });

  // client connects
  socket.on('adduser', function (username, fn) {
    if (username) {
      if (usernames[username]) {
        fn(true);
      } else {
        socket.username = username;
        usernames.push({
          "id": socket.id,
          "username": username
        });
        socket.emit('updatechat', 'Server', 'you have connected.');
        socket.broadcast.emit('updatechat', 'Server', username + ' has connected.');
        io.sockets.emit('updateusers', usernames);
        fn(false);
      }
    }
  });

  // client disconnects
  socket.on('disconnect', function () {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'Server', socket.username + ' has disconnected.');
  });

});
