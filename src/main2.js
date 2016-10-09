import fs from 'fs';
import Monopoly from './monopoly';

const monopoly = new Monopoly();

monopoly.loadPropertyArray();


fs.writeFileSync('testPropArray.json', JSON.stringify(monopoly.propertyArray, null, 2));
for (const property of monopoly.propertyArray) {
    console.log(`owner of ${property.nameStr}, ${property.ownerID} is not null: ${property.ownerId !== null}`);

    if (property.ownerId) {
        console.log('false');
    } else {
        console.log('true');
    }
}

/*class Property {
    constructor(object) {
        for (const key in object) {
            this[key] = object[key];
        }
        this.colorKey = null;
    }
}


const propertyArray = new Array(0);
const propArr = JSON.parse(fs.readFileSync('properties.json'));

console.log(propArr[4].nameStr);

/*propArr.forEach((prop) => {
    propertyArray.push(new Property(prop));
});

for (const property of propArr) {
    propertyArray.push(new Property(property));
}

fs.writeFileSync('newProperties.json', JSON.stringify(propertyArray, null, 2));
*/
