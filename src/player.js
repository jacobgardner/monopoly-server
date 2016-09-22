export default class Player{
  constructor(name, regID, socketID){//finish reading on WeakMaps for private props
    this.person = name;
    this.registeredID = regID;
    this.socketID = socketID;
    this.position = 0;
    this.money = 0;
    this.propertiesOwned = new Array(0);
    this.jailFreeCards = 0; //change to list or something;
    this.jailRolls = 0;
    this.doubles = 0;//
    this.railroadsOwned = 0;
  }

  goToJail(){
    this.jailRolls = 3;
    this.position = 9;

    return this;
  }

  movePlayer(diceArray, boardLength){
//
    this.position += diceArray.sum();
    if(this.position >= boardLength){
      this.position -= boardLength;
    }

    return this;
  }

}
