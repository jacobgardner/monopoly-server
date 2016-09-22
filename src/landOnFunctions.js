export {standardProperty, railroad, utility, eventCard, noEvent, go, goToJail, incomeTax, luxuryTax};

function standardProperty(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(`promptBuy${activePlayer.socketID}`, this, activePlayer);
  }
  else{
    emitter.emit(`promptPayment${activePlayer.socketID}`, this.ownerID, activePlayer, this.rent[this.houses]);
  }

  return this;
}

function railroad(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(`promptBuy${activePlayer.socketID}`, this, activePlayer);
  }
  else{
    emitter.emit(`promptPayment${activePlayer.socketID}`, this.ownerID, activePlayer, this.rent[this.houses]);
  }
}

function utility(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(`promptBuy${activePlayer.socketID}`, this.position);
  }
}

function eventCard(activePlayer, emitter){}

function noEvent(activePlayer, emitter){
  emitter.emit('finishTurn');
  return this;
}

function go(activePlayer, emitter){
  activePlayer.money += 200;
    emitter.emit('finishTurn');
  return this;
}

function goToJail(activePlayer, emitter){
  activePlayer.position = 9;
  activePlayer.isJailed = true;
  emitter.emit('finishTurn');
  return this;
}

function incomeTax(activePlayer, emitter){
  emitter.emit(`promptPayment${activePlayer.socketID}`, 'Bank', activePlayer, this.rent);
  return this;
}

function luxuryTax(activePlayer, emitter){
  emitter.emit(`promptPayment${activePlayer.socketID}`, 'Bank', activePlayer, this.rent);
  return this;
}
