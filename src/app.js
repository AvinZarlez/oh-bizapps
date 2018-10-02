'use strict';

let config = require('config');
let express = require('express');
let app = express();

try {
    // Adding tabs to our app. This will setup routes to letious views
    let tabs = require('./tabs');
    tabs.setup(app);
    
    // Adding a bot to our app
    let bot = require('./bot');
    bot.setup(app);
    
    // Adding a messaging extension to our app
    //let messagingExtension = require('./messaging-extension');
    //messagingExtension.setup();
    
    // Start our nodejs app
    app.listen(config.app.port, () => {
        console.log('App started listening on port ', config.app.port);
    });
} catch (error) {
    console.error('Error occurred: ', error);
}