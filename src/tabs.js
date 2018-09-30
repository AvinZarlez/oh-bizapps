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
