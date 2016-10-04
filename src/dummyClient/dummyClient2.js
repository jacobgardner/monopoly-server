import fs from 'fs';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
    console.log('connected');

    socket.on('msg', (message) => {
        console.log(message);
    });

        console.log(`not buying ${property.nameStr}`);
        socket.emit('confirmBuy', false);
    });

        socket.emit('confirmPayment');
    });


        console.log('roll prompted');
//    fs.writeFileSync('clientBoardState.json', BoardState);

        socket.emit('rollDice');
    });

        console.log('boardState received');
    });

    socket.emit('register', 'Tim', 'q2p0O');
});
