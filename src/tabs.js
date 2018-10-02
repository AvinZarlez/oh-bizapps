'use strict';

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
client_id=da78a0bf-5153-4fc3-94ae-1395dcc85ad0
&state=12345
&redirect_uri=http://localhost/myapp/permissions*/
    // MUST GET AN APP TOKEN NEXT
    /*
    https://login.microsoftonline.com/OTAProd59ops.onmicrosoft.com/oauth2/v2.0/token
    body:
    client_id=da78a0bf-5153-4fc3-94ae-1395dcc85ad0
&scope=https%3A%2F%2Fgraph.microsoft.com%2FUser.Read.All
&client_secret=uwjhe2227-@ygBSBJSAY7%*
&grant_type=client_credentials
    */
    app.get('/photo', async function(req, res) {
        let resp = await fetch(
            `https://graph.microsoft.com/v1.0/users/${req.query.userId}/photo/$value?size=48x48`,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + req.query.accessToken,
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
