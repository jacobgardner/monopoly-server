import http from 'http';
import socketio from 'socket.io';
import {Monopoly} from "./monopoly.js";
import {Player} from "./player.js";

const server = http.createServer();
const io = socketio(server);

io.on('connect', function(socket){
  //assign user, get id, etc.

  socket.on('getBoardState', function(){
    //find userID with socket.id?
    socket.broadcast.to(socket.id).emit('sendBoardState', Monopoly.BoardState());
  });

  socket.on('initiateTrade', function(){});//figure out trading.  simple to-from, this-for-that request?  counter trading?  >2 user trading, send conditions of trade to all users for acceptance?

  socket.on('initiateAuction', function(propertyID){
    //check if owned.
    //auction function.  needs to broadcast details, receive highest bids.
  });

  socket.on('rollDice', function(){//this really isnt done or anything, just testing stuff
    const dice = Monopoly.rollDice();//should also make monopoly member utilize roll action (e.g. move player on roll)
    console.log(dice[0] + dice[1]);//just a test
    io.emit('rollDice', dice);
  });

  socket.on('useCard', function(card) {});
  socket.on('disconnect', function(){});
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});
