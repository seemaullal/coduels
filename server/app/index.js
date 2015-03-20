'use strict';
var path = require('path');
var express = require('express');
var app = express();
var passport = require('passport');
var ejs = require('ejs');
module.exports = app;

require('./configure')(app);

// middleware that handles our views, ejs ('<%- %>') to render 'unescaped raw output'
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use('/api', require('./routes'));

app.use(function(req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.get('/*', function(req, res) {
    res.sendFile(app.get('indexHTMLPath'));
});

// Error catching endware.
app.use(function(err, req, res, next) {
    res.status(err.status).send(err.message);
});
