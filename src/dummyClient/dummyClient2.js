import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
    console.log('connected');

    socket.on('msg', (message) => {
        console.log(message);
    });

    socket.on('promptBuy', (property) => {
        console.log(`not buying ${property.nameStr}`);
        socket.emit('confirmBuy', false);
    });

    socket.on('promptPayment', () => {
        socket.emit('confirmPayment');
    });


    socket.on('promptRoll', (boardState) =>{
        console.log('roll prompted');
        fs.writeFileSync('clientBoardState_Tim.json', boardState);

        socket.emit('rollDice');
    });

    socket.on('boardState', (boardState) => {
        console.log('boardState received');
        fs.writeFileSync('client2BoardState.json', boardState);
    });

    socket.emit('register', 'Tim', 'q2p0O');
});
