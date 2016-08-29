```
MonopolyGame{
  PlayerList{
    [Player]{
      name;
      registerID;//for logging in players, and reconnecting d.c. players to existing profiles
      socketID;//for sending messaged to user via socket
      position;
      money;
      PropertiesOwned inherits PropertyList.Property{
        houses;
        isMonopoly;//should double rent...check rules.
      }
    }
    cardsOwned;
    transferMoney(to, amount);
    isJailed;
  }

  PropertyList{
    Property{
      name;
      propertyID;
      cost;
      rent;
      mortgage;
      ownerId;
      landOnFunction;
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
  }

  chanceList;
  communityChestList;
}
```
