import arraySort from 'array-sort';
//Takes in an array, sorts it based on {element}, and returns an array of arrays that each contain only equal values of {element}.
export default function arrayFilterSort(array, element) {
    const returnArray = new Array();
    const nullArray = new Array();

    while (array.some(property => property[element] === null)) {
        array.forEach((property, index) => {
            if (property[element] === null) {
                array.splice(index, 1);
                nullArray.push(property);
            }
        });
    }

    const workingArray = arraySort(array, element);

    while (workingArray.length > 0) {//returnArray should be and array of arrays that each carry only properies of one color type
        let property = workingArray[0];
        const filterElement = property[element];

        returnArray.push(new Array ());

        while (workingArray.length > 0 && property[element] === filterElement) {
            returnArray[returnArray.length - 1].push(workingArray.shift());

            property = workingArray[0];
        }
    }

    if (nullArray.length) {
        returnArray.push(nullArray);
    }

    return returnArray;
}
