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
      landOnFunctions{
        1//standard buyable properties
        2//railroads
        3//utilities
        4//commchest/chance
        5//free parking/jail;
        6//go
        7//go to jail
        8//income Tax
        9//luxury Tax
      }
    }
  }

  chanceList;
  communityChestList{
    cardID;
    nameStr;
    function{
      1// go to x;
      2// pay/recieve (-)x;
      3// GOoJF
      4// go to jail;
      5// pay per house;
    }
  };
}
```
