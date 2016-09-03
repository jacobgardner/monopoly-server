import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){
  console.log('connected');
//  socket.emit('rollDice');
  socket.emit('register', 'john', 1234);

  socket.on('promptRoll', function(BoardState){
    console.log('roll prompted');
    const stuff = JSON.parse(BoardState);

    socket.emit('rollDice');
  });
});
