'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    // twitter: {
    //     id: String,
    //     username: String,
    //     token: String,
    //     tokenSecret: String
    // },
    // facebook: {
    //     id: String
    // },
    google: {
        id: String
    },
    github: {
        id: String
    },
    exercises: [ {
        exerciseID: {type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
        code: String,
        score: Number,
        challenge: Boolean
    } ]
    //totalScores, completedExercises, completedChallenges can be virtuals because it's an artificial value since it's a sum of all the exercise scores

});

schema.virtual('exercises.totalScore').get(function() {
    var total = 0;
    this.exercises.forEach(function(exercise) {
        return total += exercise.score;
    })
})
// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
