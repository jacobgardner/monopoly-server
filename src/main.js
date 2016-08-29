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

  socket.on('highRoll', function(){//testing
    MonopolyGame.findFirstPlayer();
  });

  socket.on('getBoardState', function(){
    socket.broadcast.to(socket.id).emit('sendBoardState', MonopolyGame.BoardState(socket.id));
  });

  socket.on('initiateTrade', function(){});//figure out trading.  simple to-from, this-for-that request?  counter trading?  >2 user trading, send conditions of trade to all users for acceptance?

  socket.on('initiateAuction', function(propertyID){
    //check if owned.
    //auction function.  needs to broadcast details, receive highest bids.
  });

  socket.on('rollDice', function(){
    let dice = Monopoly.rollDice();//should also make monopoly member utilize roll action (e.g. move player on roll)
    dice.forEach((e) => console.log(e));
    console.log(dice[0] + dice[1]);
    io.emit('rollDice', dice);
  });

  socket.on('useCard', function(card) {});
  socket.on('disconnect', function(){});
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});
