# monopoly-server
Jim's Monopoly Server

## Installation

```
npm install
```

## Running

This command is what you want to run during development.  It will restart the server every time there's a change.

```
npm start
```

# User Documentation

Examples can also be found in *dummyClient.js*.  Functions are assumed to be
part of 'socket.io-client' object unless otherwise noted.

## .emit('register', name [, regID])

Used to take a player slot for a new game upon connection to server.

### Name

String of user's name.  Cannot be `'Bank'`, as this may result in the server
assigning user the name `'ButtFace'`.

### regID

5 character String provided to user for ranked games.  If non-ranked ID will
not be required.

## .on('promptBuy', *callback*(property, boardState))

Informs client of an opportunity to purchase a property.

### callback

Should emit a boolean value to `socket.emit('confirmBuy', bool)` after any
desired actions (e.g. Trading, Mortgaging) are
completed.  If client wishes to purchase, they should ensure they have
adequate funds available.

#### property

Property object, same as objects found in `boardState`.  Cost can be found
in `property.cost`;

#### boardState

BoardState .json file showing current state of properties and players.

## .on('promptPayment', *callback*(amount, boardState))

Informs client of money due to other players or the Bank.

### callback

Should emit to `socket.emit('confirmPayment')` once client has ensured funds
are available.

#### amount

Amount due.

#### boardState

BoardState .json file showing current state of properties and players.

## .on('promptRoll', *callback*(boardState))

Informs client it is their player's turn and they may take any number of
actions before beginning movement phase.

### callback

Should emit to `socket.emit('rollDice')` once player has taken any desired
actions.  Server will automatically roll and move and proceed to notify client
of next available action, if any.

#### boardState

BoardState .json file showing current state of properties and players.

## .on('msg', *callback*(message))

Sends clents any relevant messages to be logged, particularly non-critical
errors.

### callback

No response to server is expected.

#### message

String of message sent.
