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
    .then(null, next);
});

// post exercises created on browser
router.post('/', function(req, res, next) {
    Exercise.create(req.body)
    .then(function(content) {
       res.json(content);
    })
    .then(null, next);
});

// updates the exercise specified
router.put('/', function(req, res, next) {
    Exercise.update({_id: req.body._id}, req.body)
    .then(function(err, numUpdated, response) {
        res.json(response);
    })
    .then(null, next);
});

// deletes the exercise specified
router.delete('/:id', function(req, res, next) {
    Exercise.remove({_id: req.params.id})
    .exec()
    .then(function(response) {
        res.json(response);
    })
    .then(null, next);
});



