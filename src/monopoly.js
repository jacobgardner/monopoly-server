import Player from "./player";

export default class Monopoly {
  constructor(){
    this.PropertyList = null;
    this.ChanceList = null;
    this.CommChestList = null;
    this.PlayerList = new Array(0);
    this.currentPlayer = null;
  }

  loadPlayer(name, regID){
    //TODO: Check for registered ID.
    this.PlayerList.push(new Player(name, regID));
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

  runTurn(){}

  boardState(){}//returns JSON boardState

  cleanBoard(){
    this.PropertyList = new PropertyList;
    this.ChanceList = new ChanceList;
    this.CommChestList = new CommChestList;

    this.resetPlayers();
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
  }

  resetPlayers(){
    this.PlayerList.forEach(function(thisPlayer){
      thisPlayer.position = 0;
      thisPlayer.money = 1500;
      thisPlayer.propertiesOwned = new Array(28);
      thisPlayer.jailFreeCards = 0;
      thisPlayer.isJailed = false;
    }
  }

  static rollDice(){
    const arr = [1,2];
    return arr.map(() => (Math.floor(Math.random() * 6) + 1));
  }
}
