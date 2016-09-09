import BoardState from "./boardState";
import Player from "./player";
import fs from 'fs';
import events from 'events';

export default class Monopoly {
  constructor(){
    this.propertyArray = null;
    this.chanceList = null;
    this.commChestList = null;
    this.playerArray = new Array(0);
    this.currentPlayer = null;
    this.emitter = new events();
  }

  loadPlayer(name, regID, socketID){
    const regArray = JSON.parse(fs.readFileSync('./dist/regIDArray.json'));
    //TODO: Check for registered ID
    if(regArray.indexOf(regID) >= 0){
      this.playerArray.push(new Player(name, regID, socketID));
      console.log('Player ' + this.playerArray[this.playerArray.length - 1].person + ' added.');
      if(regArray.length == this.playerArray.length){
        console.log('runGame');
        this.runGame();
        return this;
      }
      return this;
    }
    //TODO if all ID's are registered, runGame;
    return this;
  }

  runGame(){
    this.cleanBoard();

    this.findFirstPlayer();

    this.emitter.on('nextPlayer', () => {
      if(this.playerArray.length <= 1){
        console.log(this.playerArray[0].person + ' wins');
        return this; //end game
      }
      if(this.playerArray[this.currentPlayer].money < 0){//test
        this.playerArray.splice(this.currentPlayer, 1);
        this.emitter.emit('nextPlayer');
        return this;
      }
      this.runTurn(this.playerArray[this.currentPlayer])

      return this;
    });

    this.emitter.emit('nextPlayer', () => {});

    return this;
    //TODO add wincount;
  }

  runTurn(activePlayer){
    //const thisGame = this;//because 'this' breaks with the event
    console.log('runTurn for ' + activePlayer.person + '. Player position: ' + activePlayer.position);//test

    this.emitter.once('rollDice', () => {
      this.toggleListenersOff();

      const diceArray = Monopoly.rollDice();
      console.log('dice: ' + diceArray.reduce(( acc, cur ) => acc + cur, 0));//test
      activePlayer.movePlayer(diceArray, this.propertyArray.length);
      activePlayer.money -= diceArray.reduce(( acc, cur ) => acc + cur, 0) * 10;//test
      console.log('new position ' + activePlayer.position + '. funds left: ' + activePlayer.money);//test
//      this.landOnFunction(activePlayer);TODO

      if(diceArray.every(element => element == diceArray[0])){//probably too much.  allows for more than 2 dice
        activePlayer.doubles++;
        if(activePlayer.doubles >= 3){
          activePlayer.doubles = 0;
//          this.goToJail(activePlayer);
        }
        else {
          this.runTurn(activePlayer);
          return this;
        }
      }
      else {
      activePlayer.doubles = 0;
      }

      this.currentPlayer++;//or next index or w.e. I use
      if(this.currentPlayer >= this.playerArray.length){
        this.currentPlayer = 0;
      }

      this.emitter.emit('nextPlayer', () => {});
      return this;
    });

    this.toggleListenersOn();
    console.log('Toggling Listers\n promptRolls for ' + activePlayer.person);//test
    this.emitter.emit(('promptRoll' + activePlayer.socketID) , activePlayer, () => {});
  }

  boardState(){
    const CurrentBoardState = new BoardState(this.propertyArray, this.playerArray, this.currentPlayer);
//    CurrentBoardState.playerArray.forEach(function(thisPlayer){
//      thisPlayer.socketID = null;//TODO this won't work, need to clone or just create new object....just a general idea.
//      thisPlayer.registeredID = null;
//    });

    return JSON.stringify(CurrentBoardState, null, 2);
  }//returns JSON boardState

  cleanBoard(){
    this.propertyArray = JSON.parse(fs.readFileSync('properties.JSON'));
//    this.chanceList = JSON.parse(fs.readFileSync('chance.JSON'));
//    this.commChestList = JSON.parse(fs.readFileSync('communityChest.JSON'));

    this.resetPlayers();

    return this;
  }

  findFirstPlayer(){//TODO what if ties occur
    let highRoll = 0;
    let highIndex = 0;

    this.playerArray.forEach((thisPlayer, index) => {
      const thisRoll = Monopoly.rollDice().reduce(( acc, cur ) => acc + cur, 0);
      if(thisRoll > highRoll){
        highRoll = thisRoll;
        highIndex = index;
      }
    });
    this.currentPlayer = highIndex;
    return this;
  }

  resetPlayers(){
    this.playerArray.forEach((thisPlayer) => {
      thisPlayer.position = 0;
      thisPlayer.money = 1500;
      thisPlayer.propertiesOwned = new Array(0);
      thisPlayer.jailFreeCards = 0;
      thisPlayer.isJailed = false;
      thisPlayer.doubles = 0;
    });
    return this;
  }

  static rollDice(){//DONE
    const arr = [1,2];

    return arr.map(() => (Math.floor(Math.random() * 6) + 1));
  }

  toggleListenersOn(){//TODO fill out functions
    this.emitter.on('promptTrade',() => {});
    this.emitter.on('promptAuction', () => {});
    this.emitter.on('leaveJail', (methodUsed) => {});
    this.emitter.on('houseTransaction', (position, number) => {});//positive number is build, negative is sell
    this.emitter.on('mortgageProperty', (position) => {});
    this.emitter.on('unmortgageProperty', (position) => {});
  }

  toggleListenersOff(){
    this.emitter.removeAllListeners('promptTrade');
    this.emitter.removeAllListeners('promptAuction');
    this.emitter.removeAllListeners('leaveJail');
    this.emitter.removeAllListeners('houseTransaction');
    this.emitter.removeAllListeners('mortgageProperty');
    this.emitter.removeAllListeners('unmortgageProperty');
  }
}
