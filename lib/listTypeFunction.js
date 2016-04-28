"use strict";

var listType = require('./listType.js');

const values = listType('function');
let functions = [];

// get all types of events
for (var value in values) {
    functions.push(`>${values[value]}`);
}

module.exports = functions.join('\n');
