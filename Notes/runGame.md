cleanBoard; //load clean PropertyList, card lists.

for Player in PlayerList{
  Player.reset; //set money to 1500, position to 0, empty PropertiesOwned, cardsOwned.  isJailed = false.
}

findFirstPlayer; //All players roll, highest goes first.  then next in PlayerList.  Sets PlayerList.Current to first player.

while(PlayerList.amount > 1){
  turn(PlayerList.Current);
  PlayerList.Current = PlayerList.Current.Next;
}
