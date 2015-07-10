var io = require('socket.io'),
    connect = require('connect'),
    clients = {};

var app = connect().use(connect.static('public')).listen(5000);
var chat_room = io.listen(app);

chat_room.configure(function() {
    chat_room.set("transports", ["websocket"]);
    chat_room.set("log level", 2);
  });

chat_room.sockets.on('connection', function(socket) {

  socket.emit('entrance', {
    message: 'Welcome!',
    id: socket.id,
    clients: clients
  });

  socket.on('register', function(data){
    clients[socket.id] = data;
    console.log('*****     CLIENTS ON CONNECT', clients);
    console.log('$$$$$     registering a new client!!! ', data);
    socket.broadcast.emit('createCharacter', {id:socket.id,data:data, clients: clients});
    setInterval(function(){
    socket.emit('worldUpdate', clients); 
}, 16);
  });

  socket.broadcast.emit('othersEntrance', {
    message: 'someone just came online.',
    id: socket.id
  });

  socket.on('playerPos', function(data){
    if (socket.id in clients){
      clients[socket.id] = data
    }
  });

  socket.on('cloudOn', function(data){
    socket.broadcast.emit('onCloud', data);
  });

  socket.on('leafOn', function(data){
    socket.broadcast.emit('onLeaf', data);
  });

  socket.on('disconnect', function() {
    if(socket.id in clients){
      console.log('id in clients');
      delete clients[socket.id]
    }
    console.log('%%%%%     CLIENTS ON DISCONNECT', clients)
    chat_room.sockets.emit('exit', {
      id: socket.id,
      message: 'someone has disconnected.'
    });
  });

  //CHAT
  socket.on('chat', function(data) {
    chat_room.sockets.emit('chat', {
      message: '# ' + data.message
    });
  });

});