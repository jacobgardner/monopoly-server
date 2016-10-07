import fs from 'fs';

class Property {
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
});*/

for (const property of propArr) {
    propertyArray.push(new Property(property));
}

fs.writeFileSync('newProperties.json', JSON.stringify(propertyArray, null, 2));
