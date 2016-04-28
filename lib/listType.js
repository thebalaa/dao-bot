"use strict";

var settings = require('../settings/settings.js');
var abi = settings.contract.abi;

// find names of objects with 'key'
// interfaces all have a type?
module.exports = (type) => {
    let values = [];

    // add all to an array
    for (var ele in abi) {
        if (abi[ele]['type'] === type) {
            values.push(abi[ele]['name']);
        }
    }

    return Array.from(new Set(values))
}

// abi data structure
// [{
//     "foo-a": "bar-a",
//     "foo-b": "bar-b"
// }, {
//     "foo-a": "bar-a",
//     "foo-b": "bar-b"
// }]
