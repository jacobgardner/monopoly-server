export class monopoly {
  static rollDice(){
    var dice = new Array(2);

    dice[0] = Math.floor(Math.random() * 6) + 1;
    dice[1] = Math.floor(Math.random() * 6) + 1;

    return dice;
  }
}
