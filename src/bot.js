'use strict';

let builder = require('botbuilder');
let teams = require('botbuilder-teams');
let config = require('config');
let fetch = require('node-fetch');

let botConfig = config.get('bot');
let connector = null;
let inMemoryBotStorage = null;
let bot = null;
let session = null;
let team = null;
let roster = null;
let question = null;

function registerTeam(callback) {
    if(session.message.sourceEvent.team) {
        session.send('Fetching roster to register team, please standby...');
        let conversationId = session.message.address.conversation.id;
        let team = session.message.sourceEvent.team;
        connector.fetchMembers(
            session.message.address.serviceUrl,
            conversationId,
            (err, result) => {
                if (err) {
                    session.send('err: %s', err);
                } else if(result && result.length > 0) {
                    let roster = [];
                    result.forEach((item, index) => {
                        roster.push({
                            id: item.id,
                            name: item.name
                        })
                    })
                    
                    let payload = {
                        teamId: team.id,
                        members: roster
                    };
                    
                    session.send('Team Id: %s', team.id);
                    session.send('result: %s', JSON.stringify(result));
                    session.send('Roster: %s', JSON.stringify(roster));
                    session.send('Payload: %s', JSON.stringify(payload));
                    session.send('Attempting to register team, please standby...');
                    fetch('https://msopenhack.azurewebsites.net/api/trivia/register', { 
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept':  'application/json'
                        },
                    })
                    .then(res => res.json())
                    .then(json => 
                        session.send('Registration: %s', JSON.stringify(json)))
                    .then(callback(payload));
                }
            }
        );
    } else {
        session.send('I can only register a team via a team chat...')
    }
}

function getContext(callback) {
    if(session.message.sourceEvent.team) {
        session.send('Getting team context, please standby...');
        let conversationId = session.message.address.conversation.id;
        let team = session.message.sourceEvent.team;
        connector.fetchTeamInfo(
            session.message.address.serviceUrl,
            team.id,
            (err, result) => {
                if (err) {
                    session.send('err: %s', err);
                } else {
                    callback(result);
                }
            }
        );
    } else {
        session.send('I can only get a team context via a team chat...')
    }
}

function getQuestion() {
    if(!roster) {
        session.send('I have to register the team first, please standby...');
        registerTeam((newRoster) => {
            roster = newRoster;
            getQuestion();
        })
    } else {
        session.send('Fetching a new question, please standby...');
        session.send('session.message.user: %s', JSON.stringify(session.message.user));

        let payload = {
            id: session.message.user.aadObjectId
        }
        
        session.send('payload: %s', JSON.stringify(payload));

        fetch('https://msopenhack.azurewebsites.net/api/trivia/question', { 
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 
                'Content-Type': 'application/json',
                'Accept':  'application/json'
            },
        })
        .then(res => res.json())
        .then(json => {
            question = json;
            session.send('question: %s', JSON.stringify(json));
        });  
    }  
}

function submitAnswer() {
    if(!question) {
        session.send('Let\'s get you a question, please standby...');
        getQuestion();
    } else {
        session.send('submitting your answer, please standby...');

        let payload = {
            userId: session.message.user.aadObjectId,
            questionId: question.id,
            answerId: teams.TeamsMessage.getTextWithoutMentions(session.message)
        }
        
        session.send('payload: %s', JSON.stringify(payload));

        fetch('https://msopenhack.azurewebsites.net/api/trivia/answer', { 
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 
                'Content-Type': 'application/json',
                'Accept':  'application/json'
            },
        })
        .then(res => res.json())
        .then(json => {
            session.send('answer result: %s', JSON.stringify(json));
        });  
    }  
}

module.exports.setup = (app) => {    
    // Create a connector to handle the conversations
    connector = new teams.TeamsChatConnector({
        // It is a bad idea to store secrets in config files. We try to read the settings from
        // the environment variables first, and fallback to the config file.
        // See node config module on how to create config files correctly per NODE environment
        appId: botConfig.microsoftAppId,
        appPassword: botConfig.microsoftAppPassword
    });
    
    inMemoryBotStorage = new builder.MemoryBotStorage();
    
    // Define a simple bot with the above connector that echoes what it received
    bot = new builder.UniversalBot(connector, (newSession) => {
        // Message might contain @mentions which we would like to strip off in the response
        session = newSession;
        let text = teams.TeamsMessage.getTextWithoutMentions(session.message);
        session.send('You said: %s', text);
        if (text.toLowerCase() === 'context') {
            getContext((result) => {
                session.send(`context:\n ${JSON.stringify(result)}`);
            });
        } else if(text.toLowerCase() === 'register') {
            registerTeam((result) => {
                roster = result;
            });
        } else if(text.toLowerCase() === 'q me') {
            getQuestion();;
        } else if(question) {
            submitAnswer();
        }
    }).set('storage', inMemoryBotStorage);

    // Setup an endpoint on the router for the bot to listen.
    // NOTE: This endpoint cannot be changed and must be api/messages
    app.post('/api/messages', connector.listen());

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};
