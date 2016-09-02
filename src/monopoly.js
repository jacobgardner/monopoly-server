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

  loadPlayer(name, regID){
    //TODO: Check for registered ID.
    this.PlayerArray.push(new Player(name, regID));
    //TODO if all ID's are registered, runGame;
    return this;
  }

  runGame(){
    this.cleanBoard();

    this.findFirstPlayer();

    while(PlayerArray.length > 1){
      this.runTurn(this.PlayerArray[this.currentPlayer]);
      this.currentPlayer++;//or next index or w.e. I use
      if(this.PlayerArray.length >= this.currentPlayer){
        this.currentPlayer = 0;
      }
    }

    //TODO add wincount;
  }

  runTurn(ActivePlayer){
    this.Emitter.once('rollDice', function(){
      this.toggleListenersOff();

      let diceArray = this.rollDice();
      ActivePlayer.movePlayer(diceArray, PropertyArray.length);
      this.landOnFunction(ActivePlayer);

      if(diceArray.every(element => element == diceArray[0])){//probably too much.  allows for more than 2 dice
        if(++ActivePlayer.doubles >= 3){
          ActivePlayer.doubles = 0;
          this.goToJail(ActivePlayer);
          return this;
        }
        else {
          this.runTurn(ActivePlayer);
          return this;
        }
      }
      ActivePlayer.doubles = 0;

      return this;
    });

    this.toggleListenersOn();
    this.Emitter.emit('promptRoll', ActivePlayer);
  }

  boardState(){
    const CurrentBoardState = new BoardState(this.PropertyArray, this.PlayerArray, this.currentPlayer);
    CurrentBoardState.PlayerArray.forEach(function(thisPlayer){
      thisPlayer.socketID = null;//TODO this won't work, need to clone or just create new object....just a general idea.
      thisPlayer.registeredID = null;
    });

    return JSON.stringify(CurrentBoardState);
  }//returns JSON boardState

  cleanBoard(){
    this.PropertyArray = JSON.parse(fs.readFileSync('properties.JSON'));
    this.ChanceList = JSON.parse(fs.readFileSync('chance.JSON'));
    this.CommChestList = JSON.parse(fs.readFileSync('communityChest.JSON'));

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
