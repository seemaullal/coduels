'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

// iframe route that serves up test specs from the database / NEED TO LINK UP TO DATABASE
router.get('/arena/iframe/:exerciseId', function (req, res) {
  console.log('reqparams: ', req.params);
    Exercise.findOne({_id: req.params.exerciseId}, function(err, exercise) {
      if (err) res.send(err);
      else {
        var testText = exercise.testCode;
        res.render('iframe', { exercise: testText });
      }
    });
    // var testText = "describe('add', function() {it(\"adds two numbers\", function() { var result = add(2, 3); expect(result).to.equal(5); }); it(\"adds two numbers\", function() { var result = add(3, 3); expect(result).to.equal(6); }); });";
    // res.render('iframe', {
    //     test: testText
    // });
});

//post tests created on browser
router.post('/tests', function (req, res) {
	Exercise.create(req.body, function(err, content) {
		if(err) res.send(err);
		else res.json(content);
		console.log('content;lakjds;f', content);
	});
});

router.get('/exercises', function (req, res){
	Exercise.find({}, function (err, exercises) {
		console.log(exercises);
		if (!err) res.json(exercises);
		else res.send(err);
	});
});

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});
