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

    FromPlayer.setMoney(FromPlayer.getMoney() - amount);//take money
    ToPlayer.setMoney(ToPlayer.getMoney() + amount);//give money
  }

  set setMoney(amount){//ask Jake about set and get
    this.money = amount;
  }
  get getMoney(){
    return this.money;
  }
}
