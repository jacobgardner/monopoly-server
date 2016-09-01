import Player from "./player";
import fs from 'fs';
import events from 'events';

export default class Monopoly {
  constructor(){
    this.PropertyList = null;
    this.ChanceList = null;
    this.CommChestList = null;
    this.PlayerList = new Array(0);
    this.currentPlayer = null;
    this.Emitter = new events();
  }

  loadPlayer(name, regID){
    //TODO: Check for registered ID.
    this.PlayerList.push(new Player(name, regID));
    return this;
  }

  runGame(){
    this.cleanBoard();

    this.findFirstPlayer();

    while(PlayerList.length > 1){
      this.runTurn(this.PlayerList[this.currentPlayer]);
      this.currentPlayer++;//or next index or w.e. I use
      if(this.PlayerList.length >= this.currentPlayer){
        this.currentPlayer = 0;
      }
    }

    //add wincount;
  }

  runTurn(){

  }

  boardState(){}//returns JSON boardState

  cleanBoard(){
    this.PropertyList = JSON.parse(fs.readFileSync('properties.JSON'));
    this.ChanceList = JSON.parse(fs.readFileSync('chance.JSON'));
    this.CommChestList = JSON.parse(fs.readFileSync('communityChest.JSON'));

    this.resetPlayers();

    return this;
  }

  findFirstPlayer(){//TODO what if ties occur
    let highRoll = 0;
    let highIndex = 0
    this.PlayerList.forEach(function(thisPlayer, index){
      let thisRoll = Monopoly.rollDice().reduce(( acc, cur ) => acc + cur, 0);
      if(thisRoll > highRoll){
        highRoll = thisRoll;
        highIndex = 0;
      }
    });
    return this;
  }

  resetPlayers(){
    this.PlayerList.forEach(function(thisPlayer){
      thisPlayer.position = 0;
      thisPlayer.money = 1500;
      thisPlayer.propertiesOwned = new Array(28);
      thisPlayer.jailFreeCards = 0;
      thisPlayer.isJailed = false;
    });
    return this;
  }

  static rollDice(){
    const arr = [1,2];
    return arr.map(() => (Math.floor(Math.random() * 6) + 1));
  }
}
