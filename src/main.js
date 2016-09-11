import http from 'http';
import socketio from 'socket.io';
import Monopoly from "./monopoly";

const server = http.createServer();
const io = socketio(server);
const monopolyGame = new Monopoly();

io.on('connect', (socket) => {
  //assign user, get id, etc
  console.log(' connected');

  socket.on('register', (name, regID) => {
    monopolyGame.loadPlayer(name, regID, socket.id);

  });

  monopolyGame.emitter.on(('promptBuy' + socket.id), (property) => {
    monopolyGame.toggleListenersOn();

    socket.once('confirmBuy', () => {
      monopolyGame.toggleListenersOff();
      socket.removeAllListeners('declineBuy');

      //TODO make payment, catch insufficient funds, add property.
    });

    socket.once('declineBuy', () => {
      monopolyGame.toggleListenersOff();
      socket.removeAllListeners('confirmBuy');
      monopolyGame.emit('finishTurn');
    });

    io.to(socket.id).emit('promptBuy', property, monopolyGame.boardState());
  });

  monopolyGame.emitter.on(('promptRoll' + socket.id), (activePlayer) => {
    socket.once('rollDice', () => {
      console.log('stuff');
      monopolyGame.emitter.emit('rollDice', () => {});
    });
    console.log('awaiting dice roll');
    io.to(activePlayer.socketID).emit('promptRoll', monopolyGame.boardState());
  });

  socket.on('getBoardState', () => {
    console.log('sending boardState to ' + socket.id);
    io.to(socket.id).emit('sendBoardState', monopolyGame.boardState());
  });

  socket.on('initiateTrade', () =>{});//figure out trading.  simple to-from, this-for-that request?  counter trading?  >2 user trading, send conditions of trade to all users for acceptance?

  socket.on('initiateAuction', (propertyID) => {
    //check if owned.
    //auction function.  needs to broadcast details, receive highest bids.
  });

  socket.on('useCard', (card) => {});
  socket.on('disconnect', () => {});
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
