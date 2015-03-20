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
		type: String
	}

});

mongoose.model('Exercise', schema);