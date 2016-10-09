import fs from 'fs';
import Monopoly from './monopoly';

const monopoly = new Monopoly();

monopoly.loadPropertyArray();
const JSONArray = JSON.parse(fs.readFileSync('properties.json'));

//fs.writeFileSync('testPropArray.json', JSON.stringify(monopoly.propertyArray, null, 2));
for (const property of JSONArray) {
    console.log(property.OwnerName, property.OwnerName);
    console.log(`owner of ${property.nameStr}, ${property.OwnerName} is not null: ${property.OwnerName !== null}`);

    if (property.OwnerName) {
        console.log('false');
    } else {
        console.log('true');
    }
}
const stuff = 'asdf';
const qwer = null;

console.log(`owner of ${stuff} is not null: ${stuff !== null}`);
console.log(`owner of ${qwer} is not null: ${qwer !== null}`);



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
