'use strict';

const config = require('config');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const graph = require('@microsoft/microsoft-graph-client');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const fetch = require('node-fetch');

module.exports.setup = function(app) {
    
    // Configure the view engine, views folder and the statics path
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    
    // Setup home page
    app.get('/', function(req, res) {
    });
    
    // Setup home page
    app.get('/configure', function(req, res) {
        res.render('configure');   
    });

    app.get('/leaderboard', function(req, res) {
        res.render('leaderboard');
    }); 
};
