"use strict";

var ddpclient = require('./lib/ddp.js');
var Botkit = require('botkit');
var messages = require('./settings/messages.js');
var settings = require('./settings/settings.js');
var eventArgs = require('./lib/eventArgs.js');
var formatUptime = require('./lib/formatUptime.js');
var listType = require('./lib/listType.js');
var _ = require('underscore');
var BigNumber = require('bignumber.js');

// set up bot creation
var controller = Botkit.slackbot();

// create a bot
var bot = controller.spawn({
    token: settings.slack.token,
}).startRTM((err, bot, payload) => {
    if (err) {
        return console.log(err);
    }
});

// bot info
// 'uptime' command
controller.hears(['uptime'], 'direct_message,direct_mention,mention', (bot, message) => {
    const uptime = formatUptime(process.uptime());
    bot.reply(message, `I have been running for ${uptime}.`);
});

// greeting
controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => {
        if (err) {
            convo.say(err);
            return console.log(err);
        }
        convo.ask(messages.greeting, [{
            pattern: bot.utterances.yes,
            callback: (response, convo) => {
                convo.ask(messages.about, [{
                    pattern: bot.utterances.yes,
                    callback: (response, convo) => {
                        convo.say(messages.help);
                        convo.next();
                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: (response, convo) => {
                        convo.say(`In the future, you can say \"@dao-bot help\" to see my commands :smile:`);
                        convo.next();
                    }
                }, {
                    default: true,
                    callback: (response, convo) => {
                        convo.stop();
                    }
                }]);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: (response, convo) => {
                convo.say(`In the future, you can say \"@dao-bot about\" to learn more about me :smile:`);
                convo.stop();
            }
        }, {
            default: true,
            callback: (response, convo) => {
                convo.stop();
            }
        }]);
    });
});

// 'about' command
controller.hears('about', 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => {
        if (err) {
            convo.say(err);
            return console.log(err);
        }
        convo.ask(messages.about, [{
            pattern: bot.utterances.yes,
            callback: (response, convo) => {
                convo.say(messages.help);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: (response, convo) => {
                convo.say(`In the future, you can say \"@dao-bot help\" to see my commands :smile:`);
                convo.next();
            }
        }, {
            default: true,
            callback: (response, convo) => {
                convo.stop();
            }
        }]);
    });
});

// 'help' command
controller.hears('help', 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => {
        if (err) {
            convo.say(err);
            return console.log(err);
        }
        // list all bot commands
        convo.say(messages.help);
    });
});


// Smart Contract Infomation (currently from parsing the abi bot-side)
// 'list event' command
controller.hears('list event', 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => {
        if (err) {
            convo.say(err);
            return console.log(err);
        }
        // list all of this Smart Contract's events
        convo.say(messages.list.event);
    });
});

// 'list function' command
controller.hears('list function', 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => {
        if (err) {
            convo.say(err);
            return console.log(err);
        }
        // list all of this Smart Contract's functions
        convo.say(messages.list.function);
    });
});


// DDP
// connect to Meteor server
// ddpclient.connect((err, wasReconnect) => {
//     if (err) {
//         return console.log('DDP connection error: ' + err);
//     }
//
//     if (wasReconnect) {
//         console.log('Reestablishment of a connection.');
//     }
//
//     console.log('Connected to Meteor!');
//
//
//     // events
//     // 'event latest' command
//     controller.hears('event latest', 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             // Say latest event
//             ddpclient.call('event.latest', [], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = `>*Latest Event:* ${result[0].event}\n${eventArgs(result[0])}\n>*loggedAt:* ${result[0].loggedAt}\n`;
//                 convo.say(message);
//             });
//         });
//     });
//
//     // 'event log -t < numberOfLogs >' command
//     controller.hears(['event log -t (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const numberOfLogs = Number(message.match[1]);
//
//             // Say latest numberOfLogs
//             ddpclient.call('event.logs', [numberOfLogs], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`>*Event:* ${result[log].event}\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//     // 'event log' command
//     controller.hears(['event log'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             // Say latest 25 events
//             ddpclient.call('event.logs', [25], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`>*Event:* ${result[log].event}\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//
//     // event by type
//     // 'event <type> latest' command
//     controller.hears('event (.*) latest', 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const type = message.match[1];
//             // check if type is a valid event type
//             const eventTypes = listType('event');
//             const validType = _.contains(eventTypes, type);
//
//             if (!validType == true) {
//                 convo.say(`Sorry, but '${type}' is not a valid event type (case-sensitive). Send 'list event' to see all valid events`);
//                 return;
//             }
//
//             // Say latest proposal added
//             ddpclient.call('event.type.latest', [type], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 const message = `>*Event ${type}:* ${result[0].event}\n${eventArgs(result[0])}\n>*loggedAt:* ${result[0].loggedAt}\n`;
//                 convo.say(message);
//             });
//         });
//     });
//
//     // 'event < type > log -t < numberOfLogs >' command
//     controller.hears(['event (.*) log -t (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const type = message.match[1];
//             const numberOfLogs = Number(message.match[2]);
//
//             // check if type is a valid event type
//             const eventTypes = listType('event');
//             const validType = _.contains(eventTypes, type);
//
//             if (!validType == true) {
//                 convo.say(`Sorry, but '${type}' is not a valid event type (case-sensitive). Send 'list event' to see all valid events`);
//                 return;
//             }
//
//             // Say latest numberOfLogs < type > events
//             ddpclient.call('event.type.logs', [type, numberOfLogs], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`>*Event ${type}:* ${result[log].event}\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//     // 'event < type > log' command
//     controller.hears(['event (.*) log'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const type = message.match[1];
//             // check if type is a valid event type
//             const eventTypes = listType('event');
//             const validType = _.contains(eventTypes, type);
//
//             if (!validType == true) {
//                 convo.say(`Sorry, but '${type}' is not a valid event type (case-sensitive). Send 'list event' to see all valid events`);
//                 return;
//             }
//
//             // Say latest 25 < type > events
//             ddpclient.call('event.type.logs', [type, 25], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`>*Event ${type}:* ${result[log].event}\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//
//     // proposals
//     // 'proposal log -t < numberOfLogs >' command
//     controller.hears(['proposal log -t (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const type = 'ProposalAdded';
//             const numberOfLogs = Number(message.match[1]);
//
//             // Say latest < numberOfLogs > proposals
//             ddpclient.call('event.type.logs', [type, numberOfLogs], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`>*Proposals*\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//     // 'proposal log' command
//     controller.hears(['proposal log'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const type = 'ProposalAdded';
//
//             // Say latest 25 < type > events
//             ddpclient.call('event.type.logs', [type, 25], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 let message = [];
//
//                 for (var log in result) {
//                     message.push(`${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//             });
//         });
//     });
//
//     // 'proposal id < id >' command
//     controller.hears(['proposal id (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const id = message.match[1];
//
//             // check for legitness
//             if (isNaN(id)) {
//                 convo.say(`Sorry, but '${id}' is not a valid number. Did you include extra characters`);
//                 return;
//             }
//
//             const BigNumberId = new BigNumber(id);
//
//             // Say event type "Proposal Added" with a matching proposalID
//             ddpclient.call('proposal.id', [BigNumberId], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 // check if the proposal exists
//                 if (result === undefined || result.length == 0) {
//                     convo.say('I couldn\'t find a proposal with that ID');
//                     return;
//                 }
//
//                 let message = (`>*Proposal*\n${eventArgs(result[0])}\n>*loggedAt:* ${result[0].loggedAt}\n`);
//
//                 convo.say(message);
//             });
//         });
//     });
//
//     // 'proposal events < id >' command
//     controller.hears(['proposal events (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const id = message.match[1];
//             const BigNumberId = new BigNumber(id);
//
//             // Say event type "Proposal Added" with a matching proposalID
//             ddpclient.call('proposal.id.allEvents', [BigNumberId], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 // check if the proposal exists
//                 if (result === undefined || result.length == 0) {
//                     convo.say('I couldn\'t find a proposal with that ID');
//                     return;
//                 }
//
//                 let message = [];
//
//                 message.push(`*>Proposal ${id}*`);
//
//                 for (var log in result) {
//                     message.push(`>*Proposal Event:* ${result[log].event}\n${eventArgs(result[log])}\n>*loggedAt:* ${result[log].loggedAt}\n`);
//                 }
//
//                 convo.say(message.join('\n\n'));
//
//             });
//         });
//     });
//
//     // 'proposal tag < id > < tag >' command
//     controller.hears(['proposal tag ([0-9]*) (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
//         bot.startPrivateConversation(message, (err, convo) => {
//             if (err) {
//                 convo.say(err);
//                 return console.log(err);
//             }
//
//             const id = message.match[1];
//             const BigNumberId = new BigNumber(id);
//             const tag = message.match[2];
//
//             // Say event type "Proposal Added" with a matching proposalID
//             ddpclient.call('proposal.tag', [BigNumberId, tag], (err, result) => {
//                 if (err) {
//                     convo.say(err);
//                     return console.log(err);
//                 }
//
//                 // check if the proposal exists
//                 if (result === undefined || result.length == 0) {
//                     convo.say('I couldn\'t find a proposal with that ID');
//                     return;
//                 }
//
//                 const message = (`*>Proposal ${id} tagged (${tag})*`);
//                 convo.say(message);
//
//             });
//         });
//     });
//
// });
