class BaseCard {
    constructor(object) {
        for (const key in object) {
            this[key] = object[key];
        }
    }
}

export class Advance extends BaseCard {
    drawFunction({propertyArray : propertyArray, activePlayer : activePlayer}) {

        let movePosition = null;

        if (propertyArray.some(property => property.functionID === this.functionArg)) {//if advance to nearest property type (e.g. railroad, utility)
            movePosition = propertyArray.findIndex((property, index) => {
                if (index < activePlayer) {
                    return false;
                }

                return property.functionID === this.functionArg;
            });

            if (movePosition < 0) {
                movePosition = propertyArray.findIndex(property => property.functionID === this.functionArg);
            }
        } else {
            movePosition = propertyArray.findIndex((property) => {
                return property.nameStr === this.functionArg;
            });
        }

        let moveAmount = movePosition - activePlayer;
        if (moveAmount < 0) {
            moveAmount += propertyArray.length;
        }

        activePlayer.movePlayer(moveAmount, propertyArray.length);
    }
}
export class Payment extends BaseCard {}
export class GOoJF extends BaseCard {}
export class Move extends BaseCard {}
export class Jail extends BaseCard {}
export class Repairs extends BaseCard {}
