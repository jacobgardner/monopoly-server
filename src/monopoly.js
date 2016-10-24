import BoardState from './boardState';
import Dice from './dice';
import Player from './player';
import fs from 'fs';
import events from 'events';
import randomjs from 'random-js';
import arrayFilterSort from './arrayFilterSort';
import {StandardProperty, Railroad, Utility, EventCard, NoEvent, Go, GoToJail, IncomeTax, LuxuryTax} from './properties';
import {Advance, Payment, GOoJF, Move, Jail, Repairs} from './eventCards';

export default class Monopoly {
    constructor() {
        this.propertyArray = null;
        this.chanceList = null;
        this.commChestList = null;
        this.playerArray = new Array();
        this.currentPlayer = null;
        this.emitter = new events();
        this.random = new randomjs();
        this.testLog = new Array();
        this.bankHouses = null;
        this.bankHotels = null;
    }

    get activePlayer() {
        return this.playerArray[this.currentPlayer];
    }

    loadPlayer(socketID, name, regID) {
        const regArray = JSON.parse(fs.readFileSync('./dist/regIDArray.json'));
        //TODO: Check for registered ID
        if (regArray.indexOf(regID) >= 0) {
            this.playerArray.push(new Player(name, regID, socketID));
            console.log('Player ' + this.playerArray[this.playerArray.length - 1].nameStr + ' added.');

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
                console.log(this.playerArray[0].nameStr + ' wins');
                return this; //end game
            }
            if (this.activePlayer.money < 0) {//test
                this.playerArray.splice(this.currentPlayer, 1);
                this.emitter.emit('nextPlayer');
                return this;
            }
            this.runTurn(this.activePlayer);

            return this;
        });

        this.emitter.emit('nextPlayer', () => {});

        return this;
        //TODO add wincount;
    }

    runTurn() {
        console.log('runTurn for ' + this.activePlayer.nameStr + '. Player position: ' + this.activePlayer.position);//test

        this.emitter.once('rollDice', () => {
            this.toggleListenersOff();

            const diceArray = new Dice(2, 6, this.random);
            this.activePlayer.movePlayer(diceArray.sum, this.propertyArray.length);

            console.log('dice: ' + diceArray.sum);//test
            console.log('new position ' + this.propertyArray[this.activePlayer.position].nameStr);//test

            this.emitter.once('finishTurn', () => {
                console.log(`funds left for ${this.activePlayer.nameStr}: ${this.activePlayer.money}`);

                this.checkMonopolies();
                this.checkRailroads();
                this.checkUtilities();

                if (diceArray.isDoubles) {
                    this.activePlayer.doubles++;
                    if (this.activePlayer.doubles >= 3) {
                        this.activePlayer.doubles = 0;
                        this.activePlayer.goToJail();
                    } else {
                        this.runTurn();
                        return this;
                    }
                } else {
                    this.activePlayer.doubles = 0;
                }

                this.currentPlayer++;//or next index or w.e. I use
                if (this.currentPlayer >= this.playerArray.length) {
                    this.currentPlayer = 0;
                }

                this.emitter.emit('nextPlayer', () => {});
                return this;
            });

            this.propertyArray[this.activePlayer.position].landOnFunction(this, diceArray);

            return this;
        });

        this.toggleListenersOn();
        console.log('Toggling Listers\n promptRoll for ' + this.activePlayer.nameStr);//test
        this.emitter.emit('promptRoll' , this.activePlayer);
    }

    boardState() {
        const CurrentBoardState = new BoardState(this.propertyArray, this.playerArray, this.currentPlayer);
  //    CurrentBoardState.playerArray.forEach(function(thisPlayer){
  //      thisPlayer.socketID = null;//TODO this won't work, need to clone or just create new object....just a general idea.
  //      thisPlayer.registeredID = null;
  //    });

        return JSON.stringify(CurrentBoardState, null, 2);
    }//returns JSON boardState

    checkMonopolies() {
        const standardPropertyArray = new Array();

        for (const property of this.propertyArray) {//array of only standard properties
            if (property.functionID === 'standardProperty') {
                standardPropertyArray.push(property);
            }
        }

        const arrayOfColors = arrayFilterSort(standardPropertyArray, 'colorKey');

        for (const colorArray of arrayOfColors) {
            if (colorArray.every(property => property.ownerName === colorArray[0].ownerName) && colorArray[0].ownerName !== null) {
                for (const property of colorArray) {
                    property.isMonopoly = true;
                }
            } else {
                for (const property of colorArray) {
                    property.isMonopoly = false;
                }
            }
        }

        return this;
    }

    checkRailroads() {
        const railroadArray = new Array();

        for (const property of this.propertyArray) {
            if (property.functionID === 'railroad') {
                railroadArray.push(property);
            }
        }

        const arrayOfOwners = arrayFilterSort(railroadArray, 'ownerName');

        for (const ownerArray of arrayOfOwners) {
            if (ownerArray[0].ownerName !== null) {
                for (const property of ownerArray) {
                    property.houses = ownerArray.length - 1;
                }
            }
        }

        return this;
    }

    checkUtilities() {
        const utilityArray = new Array();

        for (const property of this.propertyArray) {
            if (property.functionID === 'utility') {
                utilityArray.push(property);
            }
        }

        if (utilityArray.every(property => property.ownerName === utilityArray[0].ownerName)) {
            for (const property of utilityArray) {
                property.isMonopoly = true;
            }
        }

        return this;
    }

    cleanBoard() {
        this.bankHouses = 32;
        this.bankHotels = 12;
        this.propertyArray = this.loadJsonArray('properties.json');
        this.chanceList = this.loadJsonArray('chance.json');
        this.commChestList = this.loadJsonArray('communityChest.json');
        this.random.shuffle(this.chanceList);
        this.random.shuffle(this.commChestList);

        this.resetPlayers();

        return this;
    }

    findFirstPlayer() {
        this.random.shuffle(this.playerArray);
        this.currentPlayer = 0;
    }

    loadJsonArray(inFile) {
        const returnArray = new Array();

        const PROPERTY_TYPES = {
            'standardProperty' : StandardProperty,
            'railroad' : Railroad,
            'utility' : Utility,
            'eventCard' : EventCard,
            'noEvent' : NoEvent,
            'go' : Go,
            'goToJail' : GoToJail,
            'incomeTax' : IncomeTax,
            'luxuryTax' : LuxuryTax,
        };

        const EVENT_CARDS = {
            'advance' : Advance,
            'payment' : Payment,
            'GOoJF' : GOoJF,
            'move' : Move,
            'jail' : Jail,
            'repairs' : Repairs,
        };

        let cls = null;
        const JSONArray = JSON.parse(fs.readFileSync(inFile));

        for (const obj of JSONArray) {
            if (PROPERTY_TYPES.hasOwnProperty(obj.functionID)) {
                cls = PROPERTY_TYPES[obj.functionID];
            } else {
                cls = EVENT_CARDS[obj.functionID];
            }

            returnArray.push(new cls(obj));
        }

        return returnArray;
    }

    resetPlayers() {
        this.playerArray.forEach((thisPlayer) => {
            thisPlayer.position = 0;
            thisPlayer.money = 1500;
            thisPlayer.propertiesOwnedArray = new Array(0);
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
