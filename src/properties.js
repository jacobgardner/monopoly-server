class BaseProperty {
    constructor(object) {
        for (let key in object) {
            this[key] = object[key];
        }
    }
}

export class StandardProperty extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        if (this.ownerID === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);
            });

            emitter.emit('promptBuy', this, activePlayer);
        } else {
            emitter.once('confirmPayment', (io, monopolyGame) => {
                confirmPayment(io, monopolyGame, activePlayer, emitter, this);
            });

            emitter.emit('promptPayment', this.ownerID, activePlayer, this.rent[this.houses]);
        }

        return this;
    }
}

export class Railroad extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        if (this.ownerID === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);
            });

            emitter.emit('promptBuy', this, activePlayer);
        } else {
            emitter.once('confirmPayment', (io, monopolyGame) => {
                confirmPayment(io, monopolyGame, activePlayer, emitter, this);
            });

            emitter.emit('promptPayment', this.ownerID, activePlayer, this.rent[this.houses]);
        }

        return this;
    }
}

export class Utility extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        if (this.ownerID === null) {
            emitter.once('confirmBuy', (io, bool) => {
                confirmBuy(io, bool, activePlayer, emitter, this);
            });

            emitter.emit('promptBuy', this, activePlayer);
        }
        //TODO else utility payments
    }
}

export class EventCard extends BaseProperty {}

export class NoEvent extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        emitter.emit('finishTurn');
        return this;
    }
}

export class Go extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        activePlayer.money += 200;
        emitter.emit('finishTurn');
        return this;
    }
}

export class GoToJail extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        activePlayer.position = 9;
        activePlayer.isJailed = true;
        emitter.emit('finishTurn');
        return this;
    }
}

export class IncomeTax extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            confirmPayment(io, monopolyGame, activePlayer, emitter, this);
        });

        emitter.emit('promptPayment', this.ownerID, activePlayer, this.rent[this.houses]);
        return this;
    }
}

export class LuxuryTax extends BaseProperty {
    landOnFunction(activePlayer, emitter) {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            confirmPayment(io, monopolyGame, activePlayer, emitter, this);
        });

        emitter.emit('promptPayment', this.ownerID, activePlayer, this.rent[this.houses]);
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
            property.ownerID = activePlayer.registeredID;
            property.houses = 0;
        }
    }

    emitter.emit('finishTurn');
    return this;
}

function confirmPayment(io, monopolyGame, activePlayer, emitter, property) {
    const owner = monopolyGame.playerArray.find((element) => {
        return element.registeredID === property.ownerID;
    });

    if (activePlayer.money < property.rent[property.houses]) {
        io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
        monopolyGame.liquidateAssets(activePlayer, property.rent[property.houses]);//TODO: handle bankruptcy
    }

    activePlayer.money -= property.rent[property.houses];
    if (owner.nameStr !== 'Bank') {
        owner.money += property.rent[property.houses];
    }

    emitter.emit('finishTurn');
    return this;
}
