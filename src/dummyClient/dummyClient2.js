import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){
  console.log('connected');
//  socket.emit('rollDice');

  socket.on('sendBoardState', function(BoardState){
    console.log('boardState received');
    fs.writeFileSync('client2BoardState.json', BoardState);
  });

  socket.emit('register', 'Tim', 'q2p0O');

  socket.on('promptRoll', function(BoardState){
    console.log('roll prompted');
    const stuff = JSON.parse(BoardState);

    socket.emit('rollDice');
  });
});
