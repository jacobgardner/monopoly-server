import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){
  console.log('connected');
//  socket.emit('rollDice');
  socket.on('sendBoardState', function(BoardState){
    console.log('boardState received');
    fs.writeFileSync('clientBoardState.json', BoardState);
  });

  socket.emit('register', 'john', '9qArn');

  socket.on('promptRoll', function(BoardState){
    console.log('roll prompted');
    const stuff = JSON.parse(BoardState);

    socket.emit('rollDice');
  });
});
