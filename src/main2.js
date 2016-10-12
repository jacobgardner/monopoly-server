import fs from 'fs';
import randomjs from 'random-js';
import arraySort from 'array-sort';

const random = new randomjs();

class someObj {
    constructor() {
        this.str = makeid();
    }
}

function makeid() {
    if (random.bool()) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for ( let i=0; i < 5; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    } else {
        return null;
    }
}

const objArr = new Array();
const nullArr = new Array();

for (let i = 0; i < 25; i++) {
    objArr.push(new someObj());
}

while (objArr.some(obj => obj.str === null)) {
    objArr.forEach((obj, index) => {
        if (obj.str === null) {
            objArr.splice(index, 1);
            nullArr.push(obj);
        }
    });
}


fs.writeFileSync('unsorted.json', JSON.stringify(objArr, null, 2));
fs.writeFileSync('sorted.json', JSON.stringify(arraySort(objArr, 'str'), null, 2));
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
