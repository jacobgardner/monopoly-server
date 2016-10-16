import BoardState from './boardState';
import Dice from './dice';
import Player from './player';
import fs from 'fs';
import events from 'events';
import randomjs from 'random-js';
import arrayFilterSort from './arrayFilterSort';
import {StandardProperty, Railroad, Utility, EventCard, NoEvent, Go, GoToJail, IncomeTax, LuxuryTax} from './properties';

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
    }

    loadPlayer(socketID, name, regID) {
        const regArray = JSON.parse(fs.readFileSync('./dist/regIDArray.json'));
        //TODO: Check for registered ID
        if (regArray.indexOf(regID) >= 0) {
            this.playerArray.push(new Player(name, regID, socketID));
            console.log('Player ' + this.playerArray[this.playerArray.length - 1].nameStr + ' added.');
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
                console.log(this.playerArray[0].nameStr + ' wins');
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
        console.log('runTurn for ' + activePlayer.nameStr + '. Player position: ' + activePlayer.position);//test

        this.emitter.once('rollDice', () => {
            this.toggleListenersOff();

            const diceArray = new Dice(2, 6, this.random);
            activePlayer.movePlayer(diceArray, this.propertyArray.length);

            console.log('dice: ' + diceArray.sum);//test
            console.log('new position ' + this.propertyArray[activePlayer.position].nameStr);//test

            this.emitter.once('finishTurn', () => {
                console.log(`funds left for ${activePlayer.nameStr}: ${activePlayer.money}`);

                this.checkMonopolies();
                this.checkRailroads();
                this.checkUtilities();

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

            this.propertyArray[activePlayer.position].landOnFunction(this, diceArray);

            return this;
        });

        this.toggleListenersOn();
        console.log('Toggling Listers\n promptRoll for ' + activePlayer.nameStr);//test
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

    checkMonopolies() {
        const standardPropertyArray = new Array();

        for (const property of this.propertyArray) {//array of only standard properties
            if (property.functionID === 'standardProperty') {
                standardPropertyArray.push(property);
            }
        }

        const arrayOfColors = arrayFilterSort(standardPropertyArray, 'colorKey');
        fs.writeFileSync('arrayOfColors.json', JSON.stringify(arrayOfColors, null, 2));

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
        this.testLog.push(arrayOfOwners);
        fs.writeFileSync('arrayOfOwners.json', JSON.stringify(arrayOfOwners, null, 2));

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
        this.loadPropertyArray();
  //    this.chanceList = JSON.parse(fs.readFileSync('chance.json'));
  //    this.commChestList = JSON.parse(fs.readFileSync('communityChest.json'));

        this.resetPlayers();

        return this;
    }

    findFirstPlayer() {
        this.random.shuffle(this.playerArray);
        this.currentPlayer = 0;
    }

    loadPropertyArray() {
        this.propertyArray = new Array();

        const PROPERTY_TYPES = {
            'standardProperty' : StandardProperty,
            'railroad': Railroad,
            'utility': Utility,
            'eventCard' : EventCard,
            'noEvent' : NoEvent,
            'go' : Go,
            'goToJail' : GoToJail,
            'incomeTax' : IncomeTax,
            'luxuryTax' : LuxuryTax,
        };

        const JSONArray = JSON.parse(fs.readFileSync('properties.json'));
        for (const property of JSONArray) {
            const cls = PROPERTY_TYPES[property.functionID];

            this.propertyArray.push(new cls(property));
        }
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
