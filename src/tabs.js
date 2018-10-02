'use strict';

let config = require('config');
let path = require('path');
let express = require('express');
let fetch = require('node-fetch');
let fs = require('fs');
let uuid = require('uuid');

module.exports.setup = function(app) {
    
    // Configure the view engine, views folder and the statics path
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    
    app.get('/configure', function(req, res) {
        res.render('configure');   
    });

    // MUST CONSENT FIRST:
    /*https://login.microsoftonline.com/OTAProd59ops.onmicrosoft.com/adminconsent?
    client_id=<APP ID>
    &state=12345
    &redirect_uri=<CONFIGURED IN APP>*/
    // MUST GET AN APP TOKEN NEXT
    /*
    https://login.microsoftonline.com/OTAProd59ops.onmicrosoft.com/oauth2/v2.0/token
    body:
    client_id=<APP ID>
    &scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
    &client_secret=<APP PASSWORD>
    &grant_type=client_credentials
    */
   //USE APP TOKEN BELOW
    app.get('/photo', async (req, res) => {
        let authResp = await fetch(
            `https://login.microsoftonline.com/${config.app.microsoftAppTenantId}/oauth2/v2.0/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `client_id=${config.app.microsoftAppId}
                &scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
                &client_secret=${config.app.microsoftAppPassword}
                &grant_type=client_credentials`
            });
        let tokendata = await authResp.json();
        let resp = await fetch(
            `https://graph.microsoft.com/v1.0/users/${req.query.userId}/photo/$value?size=48x48`,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + tokendata.access_token,
                }
            });
        let data = await resp.arrayBuffer();
        let img = new Buffer(data, 'base64');
        res.contentType('image/jpeg');
        res.send(img);
    });

    app.get('/auth', function(req, res) {
        res.render('auth');   
    });

    app.get('/auth-end', function(req, res) {
        res.render('auth-end');   
    });

    app.get('/leaderboard', function(req, res) {
        res.render('leaderboard');
    }); 
};
