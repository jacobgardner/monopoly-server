import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
  console.log('connected');

  socket.on('sendBoardState', (BoardState) => {
    console.log('boardState received');
    fs.writeFileSync('clientBoardState.json', BoardState);
  });

  socket.emit('register', 'john', '9qArn');

  socket.on('promptRoll', (BoardState) => {
    console.log('roll prompted');
//    fs.writeFileSync('clientBoardState.json', BoardState);

    socket.emit('rollDice');
  });
});
