'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

// gets exercises and sends it to the browser
router.get('/exercises', function(req, res) {
    Exercise.find({}, function(err, exercises) {
        if (!err) res.json(exercises);
        else res.send(err);
    });
});

// post exercises created on browser
router.post('/exercises', function(req, res) {
    Exercise.create(req.body, function(err, content) {
        if (err) res.send(err);
        else res.json(content);
    });
});

// updates the exercise specified
router.put('/exercises', function(req, res) {
    Exercise.update({_id: req.body._id}, req.body, function(err, numUpdated, response) {
    	if (!err) res.json(response);
    	else res.send(err);
    });
});



