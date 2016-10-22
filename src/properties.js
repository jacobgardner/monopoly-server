class BaseProperty {
    constructor(object) {
        for (const key in object) {
            this[key] = object[key];
        }
    }
}

export class StandardProperty extends BaseProperty {
    const maxHouse = 4;

    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
        if (this.ownerName === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);

                emitter.emit('finishTurn');
            });

            emitter.emit('promptBuy', this, activePlayer);
        } else {
            emitter.once('confirmPayment', (io, monopolyGame) => {
                confirmPayment(io, monopolyGame, activePlayer, this);

                emitter.emit('finishTurn');
            });

            if (this.houses === 0  && this.isMonopoly) {
                emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses] * 2);
            } else {
                emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses]);
            }
        }

        return this;
    }

    /*buildStructure(io, buildNumber, {activePlayer : activePlayer, bankHouses : bankHouses, bankHotels : bankHotels}, ) {
        if(buildNumber)

        if (buildNumber + this.houses > this.maxHouse + 1) {
            io.to(activePlayer.socketID).emit('msg', 'Cannot build that many houses.  Build Cancelled');
        } else if (buildNumber * this.houseCost > activePlayer.money) {
            io.to(activePlayer.socketID).emit('msg', 'insufficient funds.  Build Cancelled');

        } else {
            activePlayer.money -= buildNumber * this.houseCost;
            this.houses += buildNumber;

        }
    }*/
}

export class Railroad extends BaseProperty {
    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
        if (this.ownerName === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);

                emitter.emit('finishTurn');
            });

            emitter.emit('promptBuy', this, activePlayer);
        } else {
            emitter.once('confirmPayment', (io, monopolyGame) => {
                confirmPayment(io, monopolyGame, activePlayer, this);

                emitter.emit('finishTurn');
            });

            emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses]);
        }

        return this;
    }
}

export class Utility extends BaseProperty {
    landOnFunction({playerArray : playerArray, activePlayer : activePlayer, emitter: emitter}, diceArray) {
        if (this.ownerName === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);

                emitter.emit('finishTurn');
            });

            emitter.emit('promptBuy', this, activePlayer);
        } else {
            let rent = 0;

            if (this.isMonopoly) {
                rent = diceArray.sum * 10;
            } else {
                rent = diceArray.sum * 4;
            }


            emitter.once('confirmPayment', (io, monopolyGame) => {
                if (activePlayer.money < rent) {
                    io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                    monopolyGame.liquidateAssets(activePlayer, rent);//TODO: handle bankruptcy
                }

                activePlayer.money -= rent;

                const owner = monopolyGame.playerArray.find((element) => {
                    return element.nameStr === this.ownerName;
                });

                owner.money += rent;

                monopolyGame.emitter.emit('finishTurn');
                return this;
            });

            emitter.emit('promptPayment', this.ownerName, activePlayer, rent);

        }
    }
}

export class EventCard extends BaseProperty {
    landOnFunction(thisGame) {
        let listsource = null;

        if (this.nameStr === 'Community Chest') {
            listsource = thisGame.commChestList;
        } else if (this.nameStr === 'Chance') {
            listsource = thisGame.chanceList;
        }

        const drawCard = listsource.shift();
        drawCard.drawFunction(thisGame);

        return this;
    }
}

export class NoEvent extends BaseProperty {
    landOnFunction({emitter: emitter}) {
        emitter.emit('finishTurn');
        return this;
    }
}

export class Go extends BaseProperty {
    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
        activePlayer.money += 200;
        emitter.emit('finishTurn');
        return this;
    }
}

export class GoToJail extends BaseProperty {
    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
//        activePlayer.position = 9;
//        activePlayer.isJailed = true;
        emitter.emit('finishTurn');
        return this;
    }
}

export class IncomeTax extends BaseProperty {
    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            confirmPayment(io, monopolyGame, activePlayer, this);

            emitter.emit('finishTurn');
        });

        emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses]);
        return this;
    }
}

export class LuxuryTax extends BaseProperty {
    landOnFunction({activePlayer : activePlayer, emitter: emitter}) {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            confirmPayment(io, monopolyGame, activePlayer, this);

            emitter.emit('finishTurn');
        });

        emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses]);
        return this;
    }
}

function confirmBuy(io, bool, activePlayer, emitter, property) {
    if (bool) {
        if (activePlayer.money < property.cost) {
            io.to(activePlayer.socketID).emit('msg', `insufficient funds, purchase of ${property.nameStr} cancelled`);//IDEA: keep track of round info to send and make game logs
        } else {
            activePlayer.money -= property.cost;
            activePlayer.propertiesOwnedArray.push(property);
            property.ownerName = activePlayer.nameStr;
            property.houses = 0;
        }
    }

    return this;
}

function confirmPayment(io, monopolyGame, activePlayer, property) {
    let rent = 0;

    if (property.houses === 0  && property.isMonopoly) {
        rent = property.rent[property.houses] * 2;
    } else {
        rent = property.rent[property.houses];
    }

    if (activePlayer.money < rent) {
        io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
        monopolyGame.liquidateAssets(activePlayer, rent);//TODO: handle bankruptcy
    }

    console.log(`rent for ${activePlayer.nameStr} is ${rent}`);
    activePlayer.money -= rent;

    if (property.ownerName !== 'Bank') {
        const owner = monopolyGame.playerArray.find((element) => {
            return element.nameStr === property.ownerName;
        });

        owner.money += rent;
    }

    return this;
}
