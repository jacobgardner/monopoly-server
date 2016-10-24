class BaseCard {
    constructor(object) {
        for (const key in object) {
            this[key] = object[key];
        }
    }
}

export class Advance extends BaseCard {
    drawFunction(thisGame) {

        let movePosition = null;

        if (thisGame.propertyArray.some(property => property.functionID === this.functionArg)) {//if advance to nearest property type (e.g. railroad, utility)
            movePosition = thisGame.propertyArray.findIndex((property, index) => {
                if (index < thisGame.activePlayer.position) {
                    return false;
                }

                return property.functionID === this.functionArg;
            });

            if (movePosition < 0) {
                movePosition = thisGame.propertyArray.findIndex(property => property.functionID === this.functionArg);
            }
        } else {
            movePosition = thisGame.propertyArray.findIndex((property) => {
                return property.nameStr === this.functionArg;
            });
        }

        let moveAmount = movePosition - thisGame.activePlayer.position;

        while (moveAmount < 0) {
            moveAmount += thisGame.propertyArray.length;
        }

        thisGame.activePlayer.movePlayer(moveAmount, thisGame.propertyArray.length);
        console.log(`card : ${this.nameStr}.  Moving ${moveAmount} spaces.\n new position ${thisGame.propertyArray[thisGame.activePlayer.position].nameStr}`);

        thisGame[this.cardStack].push(this);
        thisGame.emitter.emit('finishTurn');

        return this;
    }
}
export class Payment extends BaseCard {
    drawFunction(thisGame) {
        console.log(`card: ${this.nameStr}`);

        switch (this.from) {
        case 'Bank':
            thisGame.activePlayer.money += this.amount;

            thisGame[this.cardStack].push(this);
            thisGame.emitter.emit('finishTurn');
            break;

        case 'allPlayers':
            for (const player of thisGame.playerArray) {
                if (player !== thisGame.activePlayer) {

                    thisGame.emitter.once('confirmPayment', (io, thisGame) => {
                        if (player.money < this.amount) {
                            io.to(player.socketID).emit('msg', 'insufficient funds; liquidating assets');
                            thisGame.liquidateAssets(player, this.amount);//TODO: handle bankruptcy
                        }

                        player.money -= this.amount;
                        thisGame.activePlayer.money += this.amount;

                        thisGame[this.cardStack].push(this);
                        thisGame.emitter.emit('finishTurn');
                    });

                    thisGame.emitter.emit('promptPayment', thisGame.activePlayer.nameStr, player, this.amount);
                }
            }

            break;

        case 'activePlayer':
            if (this.to === 'Bank') {

                thisGame.emitter.once('confirmPayment', (io, thisGame) => {
                    if (thisGame.activePlayer.money < this.amount) {
                        io.to(thisGame.activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                        thisGame.liquidateAssets(thisGame.activePlayer, this.amount);//TODO: handle bankruptcy
                    }

                    thisGame.activePlayer.money -= this.amount;

                    thisGame[this.cardStack].push(this);
                    thisGame.emitter.emit('finishTurn');
                });

                thisGame.emitter.emit('promptPayment', this.to, thisGame.activePlayer, this.amount);
            } else {

                thisGame.emitter.once('confirmPayment', (io, thisGame) => {
                    if (thisGame.activePlayer.money < this.amount * (thisGame.playerArray.length - 1)) {
                        io.to(thisGame.activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                        thisGame.liquidateAssets(thisGame.activePlayer, this.amount * (thisGame.playerArray.length - 1));//TODO: handle bankruptcy
                    }

                    for (const player of thisGame.playerArray) {
                        if (player.nameStr !== thisGame.activePlayer) {
                            thisGame.activePlayer.money -= this.amount;
                            player.money += this.amount;
                        }
                    }

                    thisGame[this.cardStack].push(this);
                    thisGame.emitter.emit('finishTurn');
                });

                thisGame.emitter.emit('promptPayment', this.to, thisGame.activePlayer, this.amount + (thisGame.playerArray.length - 1));
            }
            break;
        }

        return this;
    }
}
export class GOoJF extends BaseCard {
    drawFunction(thisGame) {
        console.log(`card: ${this.nameStr}`);

        thisGame.activePlayer.GOoJFArray.push(this);
        thisGame.emitter.emit('finishTurn');

        return this;
    }
    //TODO useCard function
}
export class Move extends BaseCard {
    drawFunction(thisGame) {
        console.log(`card: "${this.nameStr}"`);

        thisGame.activePlayer.position += this.functionArg;
        while (thisGame.activePlayer.position < 0) {
            thisGame.activePlayer.position += thisGame.propertyArray.length;
        }

        thisGame[this.cardStack].push(this);
        thisGame.emitter.emit('finishTurn');
        return this;
    }
}
export class Jail extends BaseCard {
    drawFunction(thisGame) {
        console.log(`card "${this.nameStr}" is unfinished.`);
        thisGame.emitter.emit('finishTurn');

        return this;
    }
}
export class Repairs extends BaseCard {
    drawFunction(thisGame) {
        console.log(`card: ${this.nameStr}`);
        let houses = 0,
            hotels = 0;

        for (const property of thisGame.activePlayer.propertiesOwnedArray) {
            if (property.houses > 4) {
                hotels += 1;
            } else {
                houses += property.houses;
            }
        }

        const paymentAmount = houses * this.perHouse + hotels + this.perHotel;
        console.log(`Paying $${paymentAmount} for ${houses} houses and ${hotels} hotels`);

        thisGame.emitter.once('confirmPayment', (io, thisGame) => {
            if (thisGame.activePlayer.money < paymentAmount) {
                io.to(thisGame.activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                thisGame.liquidateAssets(thisGame.activePlayer, paymentAmount);//TODO: handle bankruptcy
            }

            thisGame.activePlayer.money -= paymentAmount;

            thisGame[this.cardStack].push(this);
            thisGame.emitter.emit('finishTurn');
        });

        thisGame.emitter.emit('promptPayment', 'Bank', thisGame.activePlayer, paymentAmount);

        thisGame[this.cardStack].push(this);
        thisGame.emitter.emit('finishTurn');

        return this;
    }
}
