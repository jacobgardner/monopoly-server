var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){
  console.log('connected');
//  socket.emit('rollDice');
  socket.emit('highRoll');
});
