export {standardProperty, railroad, utility, eventCard, noEvent, go, goToJail, incomeTax, luxuryTax};

function standardProperty(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(('promptBuy' + activePlayer.socketID), this.position);
  }
  else{
    emitter.emit(('promptPayment' + activePlayer.socketID), this.ownerID, this.rent[houses]);
  }

  return this;
}

function railroad(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(('promptBuy' + activePlayer.socketID), this.position);
  }
  esle{
    emitter.emit(('promptPayment' + activePlayer.socketID), this.ownerID, this.rent[houses]);
  }
}

function utility(activePlayer, emitter){
  if(this.ownerID == null){
    emitter.emit(('promptBuy' + activePlayer.socketID), this.position);
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
  emitter.emit(('promptPayment' + activePlayer.socketID), -1, this.rent);
  return this;
}

function luxuryTax(activePlayer, emitter){
  emitter.emit(('promptPayment' + activePlayer.socketID), -1, this.rent);
  return this;
}
