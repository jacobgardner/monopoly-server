```
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

MonopolyGame{
  playerArray{
    ID;
    position;
    money;
    propertiesOwned{
      property;
      houses;
      isMonopoly;//should double rent...check rules.
    }
    cardsOwned;
    transferMoney(to, amount);
  }

  propertyList{
    name;
    position;
    cost;
    rent;
    mortgage;
    ownerId;
    landonFunction;
    /*****************************
    * what to do when landed on.
    *   For buyable properties:
    *     if(buyable){
    *       promptPurchase
    *     }else{
    *       promptPayment;
    *     }
    *   For others:
    *     run specific functions
    ******************************/
  }

  chanceList;
  communityChestList;
}
```
