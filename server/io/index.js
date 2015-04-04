'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    // if (io) return io;

    // io = socketio(server);

    // io.on('connection', function (socket) {
    //     socket.on('userCode', function (code){
    //     	console.log(code);
    //     	socket.broadcast.emit('theCode', code);
    //     });

    //     socket.on('failures', function (failures){
    //         console.log('failures', failures);
    //         socket.broadcast.emit('theFailures', failures);
    //     });

    //     socket.on('testsFailed', function (arrFromIframe){
    //     	socket.broadcast.emit('failedTests', arrFromIframe);
    //     });
    // });
};
