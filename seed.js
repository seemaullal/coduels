'use strict';

var mongoose = require('mongoose');
var async = require('async');
require('./server/db/models/exercise.js');
var Exercise = mongoose.model("Exercise")

var data = {
	Exercises : [
		{ 
			name: 'Pig Latin',
			shortDescription: 'Translate English phrases into Pig Latin', 
			longDescription: 'Write a program that translates English to Pig Latin. Pig Latin has a few simple rules- Rule 1: If a word begins with a vowel sound, add "ay" to the end of the word. Rule 2: If a word begins with a consonant sound, move it to the end of the word, and then add an "ay" sound to the end of the word. There are a few more rules for edge cases; you can see http://en.wikipedia.org/wiki/Pig_latin for details.',
			editorPrompt: 'function translateToPigLatin(englishText) {\n\n}';
			testCode: "describe('pigLatin', function () {

				  it('translates a word beginning with a', function () {
				    expect(pigLatin.translate('apple')).toEqual('appleay');
				  });

				  it('translates a word beginning with e', function () {
				    expect(pigLatin.translate('ear')).toEqual('earay');
				  });

				  it('translates a word beginning with p', function () {
				    expect(pigLatin.translate('pig')).toEqual('igpay');
				  });

				  it('translates a word beginning with k', function () {
				    expect(pigLatin.translate('koala')).toEqual('oalakay');
				  });

				  it('translates a word beginning with ch', function () {
				    expect(pigLatin.translate('chair')).toEqual('airchay');
				  });

				  it('translates a word beginning with qu', function () {
				    expect(pigLatin.translate('queen')).toEqual('eenquay');
				  });

				  it('translates a word with a consonant preceding qu', function () {
				    expect(pigLatin.translate('square')).toEqual('aresquay');
				  });

				  it('translates a word beginning with th', function () {
				    expect(pigLatin.translate('therapy')).toEqual('erapythay');
				  });

				  it('translates a word beginning with thr', function () {
				    expect(pigLatin.translate('thrush')).toEqual('ushthray');
				  });

				  it('translates a word beginning with sch', function () {
				    expect(pigLatin.translate('school')).toEqual('oolschay');
				  });

				  it('translates a phrase', function () {
				    expect(pigLatin.translate('quick fast run'))
				      .toEqual('ickquay astfay unray');
				  });

				});" ,
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
		data.Exercises.forEach(function(exercise) {
			Exercise.create()
		})
	})
})