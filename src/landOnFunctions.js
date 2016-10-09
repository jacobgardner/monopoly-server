/*
keeping incase I have somethign in here I needed

export function standardProperty(activePlayer, emitter) {
    if (this.OwnerName === null) {
        emitter.once('confirmBuy', (io, bool) => {
            if (bool) {
                if (activePlayer.money < this.cost) {
                    io.to(activePlayer.socketID).emit('msg', `insufficient funds, purchase of ${this.nameStr} cancelled`);//IDEA: keep track of round info to send and make game logs
                } else {
                    activePlayer.money -= this.cost;
                    activePlayer.propertiesOwned.push(this.nameStr);
                    this.OwnerName = activePlayer.registeredID;
                    this.houses = 0;
                }
            }

            emitter.emit('finishTurn');
            return this;
        });

        emitter.emit('promptBuy', this, activePlayer);
    } else {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            const owner = monopolyGame.playerArray.find((element) => {
                return element.registeredID === this.OwnerName;
            });

            if (activePlayer.money < this.rent[this.houses]) {
                io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                monopolyGame.liquidateAssets(activePlayer, this.rent[this.houses]);//TODO: handle bankruptcy
            }

            activePlayer.money -= this.rent[this.houses];
            if (owner.nameStr !== 'Bank') {
                owner.money += this.rent[this.houses];
            }

            emitter.emit('finishTurn');
            return this;
        });

        emitter.emit('promptPayment', this.OwnerName, activePlayer, this.rent[this.houses]);
    }

    return this;
}

export function railroad(activePlayer, emitter) {
    if (this.OwnerName === null) {
        emitter.once('confirmBuy', (bool, io) => {
            if (bool) {
                if (activePlayer.money < this.cost) {
                    io.to(activePlayer.socketID).emit('msg', `insufficient funds, purchase of ${this.nameStr} cancelled`);//IDEA: keep track of round info to send and make game logs
                } else {
                    activePlayer.money -= this.cost;
                    activePlayer.propertiesOwned.push(this.nameStr);
                    this.OwnerName = activePlayer.registeredID;
                }
            }

            emitter.emit('finishTurn');
            return this;
        });

        emitter.emit('promptBuy', this, activePlayer);
    } else {
        emitter.once('confirmPayment', (io, monopolyGame) => {
            const owner = monopolyGame.playerArray.find((element) => {
                return element.registeredID === this.OwnerName;
            });

            if (activePlayer.money < this.rent[this.houses]) {
                io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
                monopolyGame.liquidateAssets(activePlayer, this.rent[this.houses]);//TODO: handle bankruptcy
            }

            activePlayer.money -= this.rent[this.houses];
            if (owner.nameStr !== 'Bank') {
                owner.money += this.rent[this.houses];
            }

            emitter.emit('finishTurn');
            return this;
        });

        emitter.emit('promptPayment', this.OwnerName, activePlayer, this.rent[this.houses]);
    }
}

export function utility(activePlayer, emitter) {
    if (this.OwnerName === null) {
        emitter.once('confirmBuy', (bool, io) => {
            if (bool) {
                if (activePlayer.money < this.cost) {
                    io.to(activePlayer.socketID).emit('msg', `insufficient funds, purchase of ${this.nameStr} cancelled`);//IDEA: keep track of round info to send and make game logs
                } else {
                    activePlayer.money -= this.cost;
                    activePlayer.propertiesOwned.push(this.nameStr);
                    this.OwnerName = activePlayer.registeredID;
                }
            }

            emitter.emit('finishTurn');
            return this;
        });

        emitter.emit('promptBuy', this, activePlayer);
    }
}

export function eventCard(activePlayer, emitter) {
    emitter.emit('finishTurn');
}

export function noEvent(activePlayer, emitter) {
    emitter.emit('finishTurn');
    return this;
}

export function go(activePlayer, emitter) {
    activePlayer.money += 200;
    emitter.emit('finishTurn');
    return this;
}

export function goToJail(activePlayer, emitter) {
    activePlayer.position = 9;
    activePlayer.isJailed = true;
    emitter.emit('finishTurn');
    return this;
}

export function incomeTax(activePlayer, emitter) {
    emitter.once('confirmPayment', (io, monopolyGame) => {
        if (activePlayer.money < this.rent) {
            io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
            monopolyGame.liquidateAssets(activePlayer, this.rent);//TODO: handle bankruptcy
        }

        activePlayer.money -= this.rent;

        emitter.emit('finishTurn');
        return this;
    });

    emitter.emit('promptPayment', 'Bank', activePlayer, this.rent);
    return this;
}

export function luxuryTax(activePlayer, emitter) {
    emitter.once('confirmPayment', (io, monopolyGame) => {
        if (activePlayer.money < this.rent) {
            io.to(activePlayer.socketID).emit('msg', 'insufficient funds; liquidating assets');
            monopolyGame.liquidateAssets(activePlayer, this.rent);//TODO: handle bankruptcy
        }

        activePlayer.money -= this.rent;

        emitter.emit('finishTurn');
        return this;
    });

    emitter.emit('promptPayment', 'Bank', activePlayer, this.rent);
    return this;
}
*/
