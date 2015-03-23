'use strict';

var mongoose = require('mongoose');
var async = require('async');
require('./server/db/models/exercise.js');
var Exercise = mongoose.model("Exercise");
mongoose.connect("mongodb://coduels:javascript15@ds031641.mongolab.com:31641/coduels").connection;

var data = {
	Exercises : [
		{ 
			name: 'Pig Latin',
			shortDescription: 'Translate English phrases into Pig Latin', 
			longDescription: 'Write a program that translates English to Pig Latin. Pig Latin has a few simple rules- Rule 1: If a word begins with a vowel sound, add "ay" to the end of the word. Rule 2: If a word begins with a consonant sound, move it to the end of the word, and then add an "ay" sound to the end of the word. There are a few more rules for edge cases; you can see http://en.wikipedia.org/wiki/Pig_latin for details.',
			editorPrompt: 'function translateToPigLatin(englishText) {\n\n}',
			testCode: "describe('pigLatin', function () {\nit('translates a word beginning with a', function () {\nexpect(translateToPigLatin('apple')).toEqual('appleay');\n});\nit('translates a word beginning with e', function () {  \nexpect(translateToPigLatin('ear')).toEqual('earay');\n});\nit('translates a word beginning with p', function () {\nexpect(translateToPigLatin('pig')).toEqual('igpay');\n});\nit('translates a word beginning with k', function () {\nexpect(translateToPigLatin('koala')).toEqual('oalakay');\n});\nit('translates a word beginning with ch', function () {\nexpect(translateToPigLatin('chair')).toEqual('airchay');\n});\nit('translates a word beginning with th', function () {  expect(translateToPigLatin('therapy')).toEqual('erapythay');\n});\nit('translates a word beginning with thr', function () {  expect(translateToPigLatin('thrush')).toEqual('ushthray');\n});\nit('translates a word beginning with sch', function () {\nexpect(translateToPigLatin('school')).toEqual('oolschay');\n});\n});\n",
			category: ['functions','regex'],
			difficulty: 'Medium'
		},
		{
			name: 'Add numbers',
			shortDescription: 'Write a function that adds two numbers',
			longDescription: 'Your add function should return the sum of the numbers that it takes in as input arguments',
			editorPrompt: 'function add(one, two) {\n\n}',
			testCode: "describe('add', function() {it(\"adds two numbers\", function() { var result = add(2, 3); expect(result).to.equal(5); }); it(\"adds two numbers\", function() { var result = add(3, 3); expect(result).to.equal(6); }); });",
			category: ['simpleFunctions'],
			difficulty: 'Easy'
		}
	]
}

mongoose.connection.on('open', function() {
	mongoose.connection.db.dropDatabase(function() {
		console.log('Adding seed data');
		async.each(data.Exercises, function(exercise, done) {
			Exercise.create(exercise, done)
		}, function(err) {
			console.log('ctrl-c to exit');
		})
	})
})