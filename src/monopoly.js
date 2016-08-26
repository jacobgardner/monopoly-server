export class Monopoly {
  constructor(){
    this.PropertyList = null;
    this.ChanceList = null;
    this.CommChestList = null;
    this.PlayerList = null;
  }

  loadPlayer(){}

  runGame(){
    this.cleanBoard();

    this.findFirstPlayer();

    while(PlayerList.length > 1){
      this.runTurn(PlayerList.current);
      PlayerList.Current = PlayerList.Current.Next;//or next index or w.e. I use
    }

    //add wincount;
  }

  runTurn(){

  }

  boardState(){}//returns JSON boardState

  cleanBoard(){
    this.PropertyList = new PropertyList;
    this.ChanceList = new ChanceList;
    this.CommChestList = new CommChestList;

    this.resetPlayers();
  }

  findFirstPlayer(){}

  resetPlayers(){}

  static rollDice(){
    return (new Array(2)).map(() => {
      return Math.floor(Math.random() * 6) + 1;
    });
  }
}
