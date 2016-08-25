export class Player{
  constructor(newID){//finish reading on WeakMaps for private props
    this.playerID = newID;
    this.postition = null;
    this.money = null;
    this.propertiesOwned = new Array(28);
    this.cardsOwned = null; //change to list or something;
    this.isJailed = false;
  }

  static transferMoney(FromPlayer, ToPlayer, amount){
    if(amount > FromPlayer){
      //throw error, inssuficient funds;
    }

    FromPlayer.money = (FromPlayer.money - amount);//take money
    ToPlayer.money = (ToPlayer.money + amount);//give money
  }

}
