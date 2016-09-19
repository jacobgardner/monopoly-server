```
On 'connect'{
  request access(good){
    assign ID(){
      new Player;
      getID;
    }
  }
  else{
    emit "need access"
  }

}


Sockets{
    To Server{
        -getAccountVal: get value of money from requested player account.

        -rollDie: 2d6 Roll

        -getPlayerPos: default to pos of all players in a container, can specify players
        -checkInventory: checks for any cards player might have (can only thinkg of get out of jail free currently)

        -useCard: use Get out of jail free card.

        -initiateTrade

        -initiateAuction

        -buildHouse: default 1, can build multiple

        -sellHouse: default 1, can sell multiple

        -forfeit

    }
    To Client{
        -promptTurn:

        -promptPurchase: when player lands on purchasable property

        -promptPayment: when player must pay to bank or other play(s)

        -sendBoardState
    }
}
```

```
Sockets V2{
  To Client{
    -sendBoardState{//should send everytime a player is prompted to ensure they have updated info
      [PlayerID{
        name;
        position;
        [propertyID];
        goojf; //number of get out of jail free cards (2 per game)
      }]
      [PropertyID{//same as position
        name;
        buyable;//Owned properties, Go, Luxury Tax, etc. are not buyable

      }]
      Available houses;//while money is not limited, there are only 32 houses and 12 hotels
      Available hotels;
    }

    -promptTurn:

    -promptPurchase: when player lands on purchasable property

    -promptPayment: when player must pay to bank or other play(s)

  }

  To Server{
    -getBoardState

    -useCard: use Get out of jail free card.

    -initiateTrade

    -initiateAuction

    -buildHouse: default 1, can build multiple

    -sellHouse: default 1, can sell multiple

    -forfeit

    -rollDie: 2d6 Roll

  }
}
