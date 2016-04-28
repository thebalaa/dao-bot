"use strict";

var listType = require('./listType.js');

const values = listType('event');
let events = [];

// get all types of events
for (var value in values) {
    events.push(`>${values[value]}`);
}

module.exports = events.join('\n');