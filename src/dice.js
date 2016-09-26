import randomjs from 'random-js';

export default class Dice {
    constructor(number, max, randomObj){
        this.random = randomObj;
        if(!(randomObj instanceof randomjs)){
            this.random = new randomjs();
        }

        this.diceArray = this.random.dice(max, number);
    }

    get isDoubles(){
        return this.diceArray.every(element => element === this.diceArray[0]);
    }

    get sum(){
        return this.diceArray.reduce(( acc, cur ) => acc + cur, 0);
    }
}
