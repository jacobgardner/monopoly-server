import BoardState from "./boardState";
import Player from "./player";
import fs from 'fs';
import events from 'events';

export default class Monopoly {
  constructor(){
    this.PropertyArray = null;
    this.ChanceList = null;
    this.CommChestList = null;
    this.PlayerArray = new Array(0);
    this.currentPlayer = null;
    this.Emitter = new events();
  }

  loadPlayer(name, regID, socketID){
    regArray = JSON.parse(fs.readFileSync('./dist/regIDArray.json'));
    //TODO: Check for registered ID
    if(regArray.includes(regID)){
      this.PlayerArray.push(new Player(name, regID, socketID));
      if(regArray.length == PlayerArray.length){
        this.runGame();
      }
      return this;
    }
    //TODO if all ID's are registered, runGame;
    return this;
  }

  runGame(){
    this.cleanBoard();

    this.findFirstPlayer();

    while(this.PlayerArray.length > 1){
      this.runTurn(this.PlayerArray[this.currentPlayer]);
      this.currentPlayer++;//or next index or w.e. I use
      if(this.PlayerArray.length >= this.currentPlayer){
        this.currentPlayer = 0;
      }
    }

    //TODO add wincount;
  }

  runTurn(ActivePlayer){
    const thisGame = this;//because 'this' breaks with the event
    console.log('runTurn.  Player position: ' + ActivePlayer.position);//test

    this.Emitter.once('rollDice', function(){
      thisGame.toggleListenersOff();

      let diceArray = thisGame.rollDice();
      console.log('dice: ' + diceArray.reduce(( acc, cur ) => acc + cur, 0));//test
      ActivePlayer.movePlayer(diceArray, thisGame.PropertyArray.length);
      console.log('new position ' + ActivePlayer.position);//test
//      thisGame.landOnFunction(ActivePlayer);TODO

      if(diceArray.every(element => element == diceArray[0])){//probably too much.  allows for more than 2 dice
        if(++ActivePlayer.doubles >= 3){
          ActivePlayer.doubles = 0;
          thisGame.goToJail(ActivePlayer);
          return this;
        }
        else {
          thisGame.runTurn(ActivePlayer);
          return this;
        }
      }
      ActivePlayer.doubles = 0;

      return this;
    });

    this.toggleListenersOn();
    console.log('Toggling Listers\n promptRoll for ' + ActivePlayer.person + ' SocketID: ' + ActivePlayer.socketID);//test
    this.Emitter.emit('promptRoll', ActivePlayer);
  }

  boardState(){
    const CurrentBoardState = new BoardState(this.PropertyArray, this.PlayerArray, this.currentPlayer);
//    CurrentBoardState.PlayerArray.forEach(function(thisPlayer){
//      thisPlayer.socketID = null;//TODO this won't work, need to clone or just create new object....just a general idea.
//      thisPlayer.registeredID = null;
//    });

    return JSON.stringify(CurrentBoardState, null, 2);
  }//returns JSON boardState

  cleanBoard(){
    this.PropertyArray = JSON.parse(fs.readFileSync('properties.JSON'));
//    this.ChanceList = JSON.parse(fs.readFileSync('chance.JSON'));
//    this.CommChestList = JSON.parse(fs.readFileSync('communityChest.JSON'));

    this.resetPlayers();

    return this;
  }

  findFirstPlayer(){//TODO what if ties occur
    let highRoll = 0;
    let highIndex = 0
    this.PlayerArray.forEach(function(thisPlayer, index){
      let thisRoll = this.rollDice().reduce(( acc, cur ) => acc + cur, 0);
      if(thisRoll > highRoll){
        highRoll = thisRoll;
        highIndex = 0;
      }
    });
    return this;
  }

  resetPlayers(){
    this.PlayerArray.forEach(function(thisPlayer){
      thisPlayer.position = 0;
      thisPlayer.money = 1500;
      thisPlayer.propertiesOwned = new Array(0);
      thisPlayer.jailFreeCards = 0;
      thisPlayer.isJailed = false;
      thisPlayer.double = 0;
    });
    return this;
  }

  rollDice(){//DONE
    const arr = [1,2];

    return arr.map(() => (Math.floor(Math.random() * 6) + 1));
  }

  toggleListenersOn(){//TODO fill out functions
    this.Emitter.on('promptTrade',function(){});
    this.Emitter.on('promptAuction', function(){});
    this.Emitter.on('leaveJail',function(methodUsed){});
    this.Emitter.on('houseTransaction',function(position, number){});//positive number is build, negative is sell
    this.Emitter.on('mortgageProperty', function(position){});
    this.Emitter.on('unmortgageProperty', function(position){});
  }

  toggleListenersOff(){
    this.Emitter.removeAllListeners('promptTrade');
    this.Emitter.removeAllListeners('promptAuction');
    this.Emitter.removeAllListeners('leaveJail');
    this.Emitter.removeAllListeners('houseTransaction');
    this.Emitter.removeAllListeners('mortgageProperty');
    this.Emitter.removeAllListeners('unmortgageProperty');
  }
}
