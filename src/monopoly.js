export class Monopoly {
  constructor(){
    this.PropertyList = null;
    this.ChanceList = null;
    this.CommChestList = null;
    this.PlayerList = null;
  }

  loadPlayer(){}

  runGame(){
    cleanBoard();

    findFirstPlayer();

    while(PlayerList.length > 1){
      runTurn(PlayerList.current);
      PlayerList.Current = PlayerList.Current.Next;//or next index or w.e. I use
    }

    //add wincount;
  }

  runTurn(){
    
  }

  cleanBoard(){
    PropertyList = new PropertyList;
    ChanceList = new ChanceList;
    CommChestList = new CommChestList;

    resetPlayers();
  }

  findFirstPlayer(){}

  resetPlayers(){}

  static rollDice(){
    var dice = new Array(2);

    dice[0] = Math.floor(Math.random() * 6) + 1;
    dice[1] = Math.floor(Math.random() * 6) + 1;

    return dice;
  }
}
