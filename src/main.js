import http from 'http';
import socketio from 'socket.io';
import Monopoly from './monopoly';

const server = http.createServer();
const io = socketio(server);
const monopolyGame = new Monopoly();

io.on('connect', (socket) => {
  //assign user, get id, etc
    console.log(' connected');

    socket.on('register', (name, regID) => {
        monopolyGame.loadPlayer(socket.id, name, regID);
        if (monopolyGame.playerArray.length === 2) {
            console.log('starting game');
            eventListenersOn();
            monopolyGame.runGame();
        }
    });

    socket.on('getBoardState', () => {
        console.log('sending boardState to ' + socket.id);
        io.to(socket.id).emit('sendBoardState', monopolyGame.boardState());
    });

    socket.on('confirmBuy', (bool) => {
        monopolyGame.toggleListenersOff();
        monopolyGame.emitter.emit('confirmBuy', io, bool);
    });

    socket.once('confirmPayment', () => {
        monopolyGame.toggleListenersOff();
        monopolyGame.emitter.emit('confirmPayment', io, monopolyGame);
    });

    socket.on('rollDice', () => {
        monopolyGame.emitter.emit('rollDice', () => {});
    });

    socket.on('initiateTrade', () =>{});//figure out trading.  simple to-from, this-for-that request?  counter trading?  >2 user trading, send conditions of trade to all users for acceptance?

    socket.on('initiateAuction', () => {
      //check if owned.
      //auction function.  needs to broadcast details, receive highest bids.
    });

    socket.on('useCard', () => {});
    socket.on('disconnect', () => {});
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

function eventListenersOn() {
    monopolyGame.emitter.on('promptBuy', (property, buyer) => {
        monopolyGame.toggleListenersOn();

        io.to(buyer.socketID).emit('promptBuy', property, monopolyGame.boardState());
    });

    monopolyGame.emitter.on('promptPayment', (owner, renter, rent) => {
        monopolyGame.toggleListenersOn();

        io.to(renter.socketID).emit('promptPayment', rent, monopolyGame.boardState());
    });

    monopolyGame.emitter.on('promptRoll', (activePlayer) => {
        console.log('awaiting dice roll');
        io.to(activePlayer.socketID).emit('promptRoll', monopolyGame.boardState());
    });

    return this;
}
