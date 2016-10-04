import BoardState from './boardState';
import Dice from './dice';
import Player from './player';
import fs from 'fs';
import events from 'events';
import randomjs from 'random-js';
import {standardProperty, railroad, utility, eventCard, noEvent, go, goToJail, incomeTax, luxuryTax} from './landOnFunctions';

export default class Monopoly {
    constructor() {
        this.propertyArray = null;
        this.chanceList = null;
        this.commChestList = null;
        this.playerArray = new Array(0);
        this.currentPlayer = null;
        this.emitter = new events();
        this.random = new randomjs();
    }

    loadPlayer(socketID, name, regID) {
        const regArray = JSON.parse(fs.readFileSync('./dist/regIDArray.json'));
        //TODO: Check for registered ID
        if (regArray.indexOf(regID) >= 0) {
            this.playerArray.push(new Player(name, regID, socketID));
            console.log('Player ' + this.playerArray[this.playerArray.length - 1].person + ' added.');
            /*if(regArray.length === this.playerArray.length){
                console.log('runGame');
                this.runGame();
                return this;
            }*/
            return this;
        }
        //TODO if all ID's are registered, runGame;
        return this;
    }

    runGame() {
        this.cleanBoard();
        this.findFirstPlayer();

        this.emitter.on('nextPlayer', () => {
            if (this.playerArray.length <= 1) {
                console.log(this.playerArray[0].person + ' wins');
                return this; //end game
            }
            if (this.playerArray[this.currentPlayer].money < 0) {//test
                this.playerArray.splice(this.currentPlayer, 1);
                this.emitter.emit('nextPlayer');
                return this;
            }
            this.runTurn(this.playerArray[this.currentPlayer]);

            return this;
        });

        this.emitter.emit('nextPlayer', () => {});

        return this;
        //TODO add wincount;
    }

    runTurn(activePlayer) {
      //const thisGame = this;//because 'this' breaks with the event
        console.log('runTurn for ' + activePlayer.person + '. Player position: ' + activePlayer.position);//test

        this.emitter.once('rollDice', () => {
            this.toggleListenersOff();

            const diceArray = new Dice(2, 6, this.random);
            activePlayer.movePlayer(diceArray, this.propertyArray.length);

            console.log('dice: ' + diceArray.sum);//test
            console.log('new position ' + this.propertyArray[activePlayer.position].nameStr);//test

            this.emitter.once('finishTurn', () => {
                console.log(`funds left: ${activePlayer.money}`);
                if (diceArray.isDoubles) {
                    activePlayer.doubles++;
                    if (activePlayer.doubles >= 3) {
                        activePlayer.doubles = 0;
                        activePlayer.goToJail();
                    } else {
                        this.runTurn(activePlayer);
                        return this;
                    }
                } else {
                    activePlayer.doubles = 0;
                }

                this.currentPlayer++;//or next index or w.e. I use
                if (this.currentPlayer >= this.playerArray.length) {
                    this.currentPlayer = 0;
                }

                this.emitter.emit('nextPlayer', () => {});
                return this;
            });

            this.propertyArray[activePlayer.position].landOnFunction(activePlayer, this.emitter);

            return this;
        });

        this.toggleListenersOn();
        console.log('Toggling Listers\n promptRoll for ' + activePlayer.person);//test
        this.emitter.emit('promptRoll' , activePlayer);
    }

    boardState() {
        const CurrentBoardState = new BoardState(this.propertyArray, this.playerArray, this.currentPlayer);
  //    CurrentBoardState.playerArray.forEach(function(thisPlayer){
  //      thisPlayer.socketID = null;//TODO this won't work, need to clone or just create new object....just a general idea.
  //      thisPlayer.registeredID = null;
  //    });

        return JSON.stringify(CurrentBoardState, null, 2);
    }//returns JSON boardState

    cleanBoard() {
        this.loadPropertyArray();
  //    this.chanceList = JSON.parse(fs.readFileSync('chance.json'));
  //    this.commChestList = JSON.parse(fs.readFileSync('communityChest.json'));

        this.resetPlayers();

        return this;
    }

    findFirstPlayer() {//TODO what if ties occur
        this.random.shuffle(this.playerArray);
        this.currentPlayer = 0;
    }

    loadPropertyArray() {
        const PROPERTY_FUNCTIONS = {
            'standardProperty': standardProperty,
            'railroad': railroad,
            'utility': utility,
            'eventCard' : eventCard,
            'noEvent' : noEvent,
            'go' : go,
            'goToJail' : goToJail,
            'incomeTax' : incomeTax,
            'luxuryTax' : luxuryTax,
        };

        this.propertyArray = JSON.parse(fs.readFileSync('properties.json'));
        this.propertyArray.forEach((property) => {
            property.landOnFunction = PROPERTY_FUNCTIONS[property.functionID];
        });
    }

    resetPlayers() {
        this.playerArray.forEach((thisPlayer) => {
            thisPlayer.position = 0;
            thisPlayer.money = 1500;
            thisPlayer.propertiesOwned = new Array(0);
            thisPlayer.jailFreeCards = 0;
            thisPlayer.jailRolls = 0;
            thisPlayer.doubles = 0;
        });
        return this;
    }

    toggleListenersOn() {//TODO fill out functions
        this.emitter.on('promptTrade',() => {});
        this.emitter.on('promptAuction', () => {});
        this.emitter.on('leaveJail', (methodUsed) => {});
        this.emitter.on('houseTransaction', (position, number) => {});//positive number is build, negative is sell
        this.emitter.on('mortgageProperty', (position) => {});
        this.emitter.on('unmortgageProperty', (position) => {});
    }

    toggleListenersOff() {
        this.emitter.removeAllListeners('promptTrade');
        this.emitter.removeAllListeners('promptAuction');
        this.emitter.removeAllListeners('leaveJail');
        this.emitter.removeAllListeners('houseTransaction');
        this.emitter.removeAllListeners('mortgageProperty');
        this.emitter.removeAllListeners('unmortgageProperty');
    }
}
