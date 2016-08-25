import http from 'http';
import socketio from 'socket.io';
import {Monopoly} from "./monopoly.js";
import {PlayerList} from "./player.js";

const server = http.createServer();
const io = socketio(server);

io.on('connect', function(socket){
  //assign user
  socket.on('getAccountVal', function(playerId){
    io.emit('getAccountVal', Monopoly.getAccountVal(playerId));
  });

  socket.on('rollDice', function(){//this really isnt done or anything, just testing stuff
    const dice = Monopoly.rollDice();//should also make monopoly member utilize roll action (e.g. move player on roll)
    console.log(dice[0] + dice[1]);//just a test
    io.emit('rollDice', dice);
  });

  //need to default getPlayerPos
  socket.on('getPlayerPos', function(playerId){
    io.emit('getPlayerPos', Monopoly.getPlayerPos(playerId));
  });

  socket.on('checkInventory', function(){});
  socket.on('useCard', function(card) {});
  socket.on('disconnect', function(){});
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});
