'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

router.use('/exercises',require('./exercises.js'));
router.use(require('./users.js'));

// iframe route that serves up test specs from the database
router.get('/arena/iframe/:exerciseId', function(req, res) {
    Exercise.findOne({
        _id: req.params.exerciseId
    }, function(err, exercise) {
        if (err) res.send(err);
        else {
            var testText = exercise.testCode;
            res.render('iframe', {
                exercise: testText
            });
        }
    });
});

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});
