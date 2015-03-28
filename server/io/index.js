'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        socket.on('userCode', function (code){
        	console.log('the userCode in index.js', code);
        	socket.broadcast.emit('theCode', code);
        });

        socket.on('failures', function (failures){
<<<<<<< HEAD
            console.log('failures', failures);
            socket.broadcast.emit('theFailures', failures);
        });

        socket.on('testsFailed', function (arrFromIframe){
        	socket.broadcast.emit('failedTests', arrFromIframe);
=======
        	console.log('the failures in index.js', failures);
        	socket.broadcast.emit('theFailures', failures);
>>>>>>> 1c0fe5ebf348846fd82bede7d9eee29b9ec08f25
        });
    });
};
