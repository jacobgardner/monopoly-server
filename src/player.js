export default class Player{
  constructor(name, regID, socketID){//finish reading on WeakMaps for private props
    this.person = name;
    this.registeredID = regID;
    this.socketID = socketID;
    this.position = null;
    this.money = null;
    this.propertiesOwned = new Array(0);
    this.jailFreeCards = null; //change to list or something;
    this.isJailed = false;
    this.doubles = null;//
  }

  movePlayer(diceArray, boardLength){//DONE
    this.position += diceArray.reduce(( acc, cur ) => acc + cur, 0);
    if(this.position >= boardLength){
      this.position -= boardLength;
    }

    return this;
  }

}
