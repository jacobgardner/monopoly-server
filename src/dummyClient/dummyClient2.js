import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
  console.log('connected');

  socket.on('msg', (message) => {
    console.log(message);
  });

  socket.on('promptBuy', (property, boardState) => {
    console.log(`not buying ${property.nameStr}`);
    socket.emit('confirmBuy', false);
  });

  socket.on('promptPayment', (amount) => {
    socket.emit('confirmPayment');
  });


  socket.on('promptRoll', (BoardState) =>{
    console.log('roll prompted');
//    fs.writeFileSync('clientBoardState.json', BoardState);

    socket.emit('rollDice');
  });

  socket.on('sendBoardState', (BoardState) => {
    console.log('boardState received');
    fs.writeFileSync('client2BoardState.json', BoardState);
  });

  socket.emit('register', 'Tim', 'E2K3C');
});
