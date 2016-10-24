import fs from 'fs';
import randomjs from 'random-js';

const MY_NAME = 'tim';
const random = new randomjs();
var socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', () => {
    console.log('connected');

    socket.on('msg', (message) => {
        console.log(message);
    });

    socket.on('promptBuy', (property) => {
        if (random.bool()) {
            console.log(`not buying ${property.nameStr}`);
            socket.emit('confirmBuy', false);
        } else {
            console.log(`buying ${property.nameStr}`);
            socket.emit('confirmBuy', true);
        }
    });

    socket.on('promptPayment', (amount, boardState) => {
        boardState = JSON.parse(boardState);

        const me = boardState.playerArray.find((player) => {
            return player.nameStr === MY_NAME;
        });
        const property = boardState.propertyArray[me.position];

        console.log(`paying ${amount} on ${property.nameStr}`);
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

    socket.emit('register', MY_NAME, 'q2p0O');
});
