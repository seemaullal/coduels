'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

// gets exercises and sends it to the browser
router.get('/', function(req, res, next) {
    Exercise
    .find({})
    .exec()
    .then(function(exercises) {
        res.json(exercises);
    })
    .then(null, function(err) {
        next(err);
    });
});

// post exercises created on browser
router.post('/', function(req, res, next) {
    Exercise.create(req.body)
    .then(function(content) {
       res.json(content);
    })
    .then(null, function(err) {
        next(err);
    });
});

// updates the exercise specified
router.put('/', function(req, res, next) {
    Exercise.update({_id: req.body._id}, req.body)
    .then(function(err, numUpdated, response) {
        res.json(response);
    })
    .then(null, function(err) {
        next(err);
    });
});

// deletes the exercise specified
router.delete('/:id', function(req, res, next) {
    Exercise.findOneAndRemove({_id: req.params.id})
    .then(function (response) {
        res.json(response);
    })
    .then(null, function(err) {
        next(err);
    });
});



