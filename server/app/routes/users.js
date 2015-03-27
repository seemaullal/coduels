'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;

router.post('/users/:userId/exercises/', function (req, res, next) {
	var userId = req.params.userId;
	var exercisesObj = req.body;

	User.findByIdAndUpdate(userId, {$push: {exercises: exercisesObj}}, function (err, user) {
		if (!err) res.json(user);
		else next(err);
	});
});