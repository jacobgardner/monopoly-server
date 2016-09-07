import http from 'http';
import socketio from 'socket.io';
import Monopoly from "./monopoly";

const server = http.createServer();
const io = socketio(server);
const MonopolyGame = new Monopoly();

io.on('connection', function(socket){
  //assign user, get id, etc
  console.log('connected');

  socket.on('register', function(name, regID){
    MonopolyGame.loadPlayer(name, regID, socket.id);
  });

  MonopolyGame.Emitter.on('promptRoll', function(ActivePlayer){
    socket.once('rollDice', function(){
      console.log('stuff');
      MonopolyGame.Emitter.emit('rollDice');
    });
    console.log('awaiting dice roll');
    io.to(ActivePlayer.socketID).emit('promptRoll', MonopolyGame.boardState());
  });

  socket.on('getBoardState', function(){
    console.log('sending boardState to ' + socket.id);
    io.to(socket.id).emit('sendBoardState', MonopolyGame.boardState());
  });

  socket.on('initiateTrade', function(){});//figure out trading.  simple to-from, this-for-that request?  counter trading?  >2 user trading, send conditions of trade to all users for acceptance?

  socket.on('initiateAuction', function(propertyID){
    //check if owned.
    //auction function.  needs to broadcast details, receive highest bids.
  });

  socket.on('useCard', function(card) {});
  socket.on('disconnect', function(){});
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});
