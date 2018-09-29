'use strict';

var config = require('config');
var express = require('express');
var app = express();

try {
    // Adding tabs to our app. This will setup routes to various views
    var tabs = require('./tabs');
    tabs.setup(app);
    
    // Adding a bot to our app
    var bot = require('./bot');
    bot.setup(app);
    
    // Adding a messaging extension to our app
    //var messagingExtension = require('./messaging-extension');
    //messagingExtension.setup();
    
    // Start our nodejs app
    app.listen(config.app.port, function() {
        console.log('App started listening on port ', config.app.port);
    });
} catch (error) {
    console.error('Error occurred: ', error);
}