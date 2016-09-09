import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
  console.log('connected');

  socket.on('sendBoardState', (BoardState) => {
    console.log('boardState received');
    fs.writeFileSync('client2BoardState.json', BoardState);
  });

  socket.emit('register', 'Tim', 'q2p0O');

  socket.on('promptRoll', (BoardState) =>{
    console.log('roll prompted');
//    fs.writeFileSync('clientBoardState.json', BoardState);

    socket.emit('rollDice');
  });
});
