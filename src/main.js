var server = require('http').createServer();
var io = require('socket.io')(server);
import {monopoly} from "./monopoly.js";


io.on('connect', function(socket){
  //assign user
  socket.on('getAccountVal', function(playerId){
    io.emit('getAccountVal', monopoly.getAccountVal(playerId));
  });

  socket.on('rollDice', function(){
    dice = monopoly.rollDice();//should also make monopoly member utilize roll action (e.g. move player on roll)
    console.log(dice[0] + dice[1]);
    io.emit('rollDice', dice);
  });

  //need to default getPlayerPos
  socket.on('getPlayerPos', function(playerId){
    io.emit('getPlayerPos', monopoly.getPlayerPos(playerId));
  });

  socket.on('checkInventory', function(){});
  socket.on('useCard', function(card) {});
  socket.on('disconnect', function(){});
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});
