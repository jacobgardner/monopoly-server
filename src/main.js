import http from 'http';
import socketio from 'socket.io';
import Monopoly from "./monopoly";

const server = http.createServer();
const io = socketio(server);
const MonopolyGame = new Monopoly();

io.on('connect', function(socket){
  //assign user, get id, etc
  console.log('connected');

  socket.on('register', function(name, regID){
    MonopolyGame.loadPlayer(name, regID);
  });

  MonopolyGame.Emitter.on('promptRoll', function(ActivePlayer){
    socket.broadcast.to(ActivePlayer.socketID).emit('promptRoll', MonopolyGame.BoardState());
    socket.once('rollDice', rollDice());
  });

  socket.on('getBoardState', function(){
    socket.broadcast.to(socket.id).emit('sendBoardState', MonopolyGame.BoardState());
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

function rollDice(){
  if(socket.id != ActivePlayer.socketID){//TODO check to see if socket.id and ActivePlayer tranfers like this
    socket.once('rollDice', rollDice());
  }
  else{
    MonopolyGame.Emitter.emit('rollDice');
  }
};
