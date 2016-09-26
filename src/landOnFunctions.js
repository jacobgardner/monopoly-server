export function standardProperty(activePlayer, emitter){
    if(this.ownerID === null){
        emitter.emit(`promptBuy${activePlayer.socketID}`, this, activePlayer);
    }
    else{
        emitter.emit(`promptPayment${activePlayer.socketID}`, this.ownerID, activePlayer, this.rent[this.houses]);
    }

    return this;
}

export function railroad(activePlayer, emitter){
    if(this.ownerID === null){
        emitter.emit(`promptBuy${activePlayer.socketID}`, this, activePlayer);
    }
    else{
        emitter.emit(`promptPayment${activePlayer.socketID}`, this.ownerID, activePlayer, this.rent[this.houses]);
    }
}

export function utility(activePlayer, emitter){
    if(this.ownerID === null){
        emitter.emit(`promptBuy${activePlayer.socketID}`, this, activePlayer);
    }
}

export function eventCard(activePlayer, emitter){}

export function noEvent(activePlayer, emitter){
    emitter.emit('finishTurn');
    return this;
}

export function go(activePlayer, emitter){
    activePlayer.money += 200;
    emitter.emit('finishTurn');
    return this;
}

export function goToJail(activePlayer, emitter){
    activePlayer.position = 9;
    activePlayer.isJailed = true;
    emitter.emit('finishTurn');
    return this;
}

export function incomeTax(activePlayer, emitter){
    emitter.emit(`promptPayment${activePlayer.socketID}`, 'Bank', activePlayer, this.rent);
    return this;
}

export function luxuryTax(activePlayer, emitter){
    emitter.emit(`promptPayment${activePlayer.socketID}`, 'Bank', activePlayer, this.rent);
    return this;
}
