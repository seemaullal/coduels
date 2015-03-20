'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Exercise = mongoose.model('Exercise');
module.exports = router;

// iframe route that serves up test specs from the database / NEED TO LINK UP TO DATABASE
router.get('/arena/iframe', function(req, res) {
    var testText = "describe('add', function() {it(\"adds two numbers\", function() { var result = add(2, 3); expect(result).to.equal(5); }); });";
    res.render('iframe', {
        test: testText
    });
});

//post tests created on browser
router.post('/tests', function(req, res) {
	Exercise.create(req.body, function(err, content) {
		if(err) res.send(err);
		else res.json(content);
		console.log('content;lakjds;f', content);
	})
})


// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});
