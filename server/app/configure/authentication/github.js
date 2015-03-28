'use strict';
var path = require('path');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {
    var githubConfig = app.getValue('env').GITHUB;

    var githubCredentials = {
        clientID: githubConfig.clientID,
        clientSecret: githubConfig.clientSecret,
        callbackURL: githubConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        UserModel.findOne({ 'github.id': profile.id }, function (err, user) {
            if (err) return done(err);

            if (user) {
                done(null, user);
            } else {
                UserModel.create({
                    github: {
                        id: profile.id
                    },
                    username: profile.username,
                    image: profile.avatar_url
                }).then(function (user) {
                    done(null, user);
                }, function (err) {
                    console.error(err);
                    done(err);
                });
            }

        });
    };


    passport.use(new GithubStrategy(githubCredentials, verifyCallback));

    
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
            
        });
};