'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;

router.get('/users', function(req, res) {
	User.find({}, function(err, user) {
		var userArr = [];
		user.forEach(function(user) {
			userArr.push(user.toObject({virtuals:true}));
		});
		res.json(userArr);
	});
});

router.post('/users/:userId/exercises/', function (req, res, next) {
	var userId = req.params.userId;
	var exercisesObj = req.body;

	User.findByIdAndUpdate(userId, {$push: {exercises: exercisesObj}}, function (err, user) {
		if (!err) res.json(user.toObject({virtuals:true}));
		else next(err);
	});
});

router.get('/user/:userId', function (req, res, next) {
	var userId = req.params.userId;
	User.findById(userId).populate('exercises.exerciseID').exec(function (err, user) {
		if (!err) res.json(user.toObject({virtuals:true}));
		else next(err);
	});
});