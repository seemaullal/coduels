'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String
	},
	shortDescription: {
		type: String
	},
	longDescription: {
		type: String
	},
	editorPrompt: {
		type: String
	},
	testCode: {
		type: String
	},
	category: {
		type: [String]
	},
	difficulty: {
		type: String,
		enum: ['Easy', 'Medium', 'Hard']
	},
	time: {
		type: Date,
		default: Date.now
	}
});

var Exercise = mongoose.model('Exercise', schema);

module.exports = {
	Exercise: Exercise
}
