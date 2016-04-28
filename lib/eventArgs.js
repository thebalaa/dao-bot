"use strict";

var _ = require('underscore');
var BigNumber = require('bignumber.js');

// parse event args
module.exports = (event) => {
    const args = event.args;
    let parsed = [];

    for (var arg in args) {
        if (_.isObject(args[arg])) {
            const c = args[arg].c.toString();
            const e = Number(args[arg].e);
            const s = Number(args[arg].s);

            if (arg === "proposalID" && (event.tag)) {
                if (c.length - 1 === e) {
                    parsed.push(`>*${arg}:* ${c} (${event.tag})`);
                } else {
                    parsed.push(`>*${arg}:* ${c} ${e} ${s} (${event.tag})`);
                }
            } else {
                if (c.length - 1 === e) {
                    parsed.push(`>*${arg}:* ${c}`);
                } else {
                    parsed.push(`>*${arg}:* ${c} ${e} ${s}`);
                }
            }

        } else {
            parsed.push(`>*${arg}:* ${args[arg]}`);
        }
    }

    return parsed.join('\n');
}
