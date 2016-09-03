import fs from 'fs';

const playerNum = 2;

const baseArray = ['a', 'a'];
const idArray = baseArray.map(() => makeid());

fs.writeFileSync('regIDArray.json', JSON.stringify(idArray, null, 2));


function makeid()
{
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
