```
MonopolyGame{
  playerArray{
    Player{
      iD;
      position;
      money;
      PropertiesOwned inherits PropertyList.Property{
        houses;
        isMonopoly;//should double rent...check rules.
      }
    }
    cardsOwned;
    transferMoney(to, amount);
  }

  PropertyList{
    Property{
      name;
      propertyID;
      position;
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
