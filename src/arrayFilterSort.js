import arraySort from 'array-sort';
//Takes in an array, sorts it based on {element}, and returns an array of arrays that each contain only equal values of {element}
export default function arrayFilterSort(array, element) {
    const returnArray = new Array();
    const workingArray = arraySort(array, element);

    while (workingArray.length > 0) {//returnArray should be and array of arrays that each carry only properies of one color type
        const property = workingArray[0];
        const filterElement = property[element];

        returnArray.push(new Array ());

        let moreProperty = property;
        while (workingArray.length > 0 && moreProperty[element] === filterElement) {
            workingArray.splice(0, 1);
            returnArray[returnArray.length - 1].push(moreProperty);

            moreProperty = workingArray[0];
        }
    }

    return returnArray;
}
