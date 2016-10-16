class BaseProperty {
    constructor(object) {
        for (const key in object) {
            this[key] = object[key];
        }
    }
}

export class StandardProperty extends BaseProperty {
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];

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
}

export class Railroad extends BaseProperty {
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];

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
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}, diceArray) {
        const activePlayer = playerArray[currentPlayer];
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
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];
        emitter.emit('finishTurn');
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
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];
        activePlayer.money += 200;
        emitter.emit('finishTurn');
        return this;
    }
}

export class GoToJail extends BaseProperty {
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];
//        activePlayer.position = 9;
//        activePlayer.isJailed = true;
        emitter.emit('finishTurn');
        return this;
    }
}

export class IncomeTax extends BaseProperty {
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];
        emitter.once('confirmPayment', (io, monopolyGame) => {
            confirmPayment(io, monopolyGame, activePlayer, this);

            emitter.emit('finishTurn');
        });

        emitter.emit('promptPayment', this.ownerName, activePlayer, this.rent[this.houses]);
        return this;
    }
}

export class LuxuryTax extends BaseProperty {
    landOnFunction({playerArray : playerArray, currentPlayer = currentPlayer, emitter: emitter}) {
        const activePlayer = playerArray[currentPlayer];
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
            activePlayer.propertiesOwned.push(property.nameStr);
            property.ownerName = activePlayer.nameStr;
            property.houses = 0;
        }
    }

    return this;
}

function confirmPayment(io, monopolyGame, activePlayer, property) {
    /*const rent = () => {
        if (property.houses === 0  && property.isMonopoly) {
            return property.rent[property.houses] * 2;
        } else {
            return property.rent[property.houses];
        }
    };*/
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
