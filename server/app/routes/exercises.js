'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

// post exercises created on browser
router.post('/exercises', function(req, res) {
    Exercise.create(req.body, function(err, content) {
        if (err) res.send(err);
        else res.json(content);
        console.log('content;lakjds;f', content);
    });
});

// gets exercises and sends it to the browser
router.get('/exercises', function(req, res) {
    Exercise.find({}, function(err, exercises) {
        console.log(exercises);
        if (!err) res.json(exercises);
        else res.send(err);
    });
});


