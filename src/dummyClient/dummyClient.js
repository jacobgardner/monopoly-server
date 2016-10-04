import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
    console.log('connected');

    socket.on('msg', (message) => {
        console.log(message);
    });

    socket.on('promptBuy', (property) => {
        console.log(`buying ${property.nameStr}`);
        socket.emit('confirmBuy', true);
    });

    socket.on('promptPayment', () => {
        socket.emit('confirmPayment');
    });

    socket.on('promptRoll', () => {
        console.log('roll prompted');
//    fs.writeFileSync('clientBoardState.json', BoardState);
        socket.emit('rollDice');
    });

    socket.on('sendBoardState', (boardState) => {
        console.log('boardState received');
        fs.writeFileSync('clientBoardState.json', boardState);
    });

    socket.emit('register', 'john', '9qArn');
});
