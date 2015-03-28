'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;

router.post('/users/:userId/exercises/', function (req, res, next) {
	var userId = req.params.userId;
	var exercisesObj = req.body;

	User.findByIdAndUpdate(userId, {$push: {exercises: exercisesObj}}, function (err, user) {
		console.log('>> user unique challenges <<', user.uniqueChallenges);
		if (!err) res.json(user.toObject({virtuals:true}));
		else next(err);
	});
});