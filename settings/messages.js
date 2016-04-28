"use strict";

var listTypeEvent = require('../lib/listTypeEvent.js');
var listTypeFunction = require('../lib/listTypeFunction.js');
var settings = require('./settings.js');

module.exports = {
    greeting: "Hi, I'm an Ethereum smart contract a utility bot. Would you like to know more?\n(yes/no)",
    about: `I\'m currently listening to the *${settings.contract.name}* smart contract (${settings.contract.address}) on the *testnet*.\n\nProject development donations: 0x1A416af553Faca53b4be48DCFB6E749C9737455D.\n\nMore info here: ${settings.bot.guide}\n\nWebapp here: ${settings.daoApi.host}\n\nWould you like to see my commands?\n(yes/no)`,
    help: "*Usage:* @dao-bot <command>\n\n>*Commands*\n\n>about\n>Information about this bot\n\n>help\n>List of commands and other helpful information\n\n>list event\n>List this contract's events\n\n>list function\n>List this contract's functions\n\n>event latest\n>Shows the latest event\n\n>event log\n>Shows a log of the last 25 events\n\n>event log -t < numberOfLogs >\n>Shows the latest < numberOfLogs > events\n\n>event < type > latest\n>Shows the latest < type > event added\n\n>event < type > log\n>Shows a log of the last 25 < type > events\n\n>event < type > log -t < numberOfLogs >\n>Shows the latest < numberOfLogs > < type > events\n\n>proposal id < id >\n>Shows the proposal with the id < id >\n\n>proposal events < id >\n>Shows all events of the proposal with the id < id >\n\n>proposal tag < id > < tag >\n>tags a proposalID for all users\n\n>uptime\n>Shows how long this bot has been running",
    list: {
        event: `>*Contract Events*\n${listTypeEvent}`,
        function: `>*Contract Functions*\n${listTypeFunction}`
    }
}
