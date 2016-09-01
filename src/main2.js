import http from 'http';
import socketio from 'socket.io';
import Monopoly from "./monopoly";
import Property from "./property";
import fs from 'fs';
//import "./cardProps/properties.json";
let PropertyArray = new Array(0);
let propArr = JSON.parse(fs.readFileSync('properties.json'));

console.log(propArr[4].nameStr);

propArr.forEach(function(prop){
  PropertyArray.push(new Property(prop.nameStr, prop.cost, prop.rent, prop.houseCost, prop.mortgage, prop.isBuyable, prop.function));
});

fs.writeFileSync('newProperties.json', JSON.stringify(PropertyArray, null, 2));
