'use strict'

app.factory('TimeLeftFactory', function() {

	var factory = {};

	factory.countDown = function(startTime) {
        return Math.max(0, startTime - Date.now());
    }

	return factory;
})