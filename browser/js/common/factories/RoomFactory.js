'use strict'
app.factory('RoomFactory', function($firebaseObject, $q) {

    var factory = {}

    var rooms = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms');

    factory.activeRooms = [];

    factory.createRoom = function(exercise, user,isChallenge) {
        var gameStartTime = new Date();
        gameStartTime = gameStartTime.setSeconds(gameStartTime.getSeconds() + 20);

        var roomData = {
            users: [user],
            exerciseId: exercise._id,
            exerciseName: exercise.name,
            shortDescription: exercise.shortDescription,
            longDescription: exercise.longDescription,
            editorPrompt: exercise.editorPrompt,
            testCode: exercise.testCode,
            category: exercise.category,
            difficulty: exercise.difficulty,
            gameStartTime: gameStartTime,
            winner: null,
            isPractice: false
        };
        var roomKey = rooms.push(roomData).key();
        if (isChallenge) {
        factory.activeRooms.push(roomKey);
        }
        return roomKey;
    };

    factory.createPracticeRoom = function(exercise, user,isChallenge) {
        var gameStartTime = new Date();
        var roomData = {
            users: [user],
            exerciseId: exercise._id,
            exerciseName: exercise.name,
            shortDescription: exercise.shortDescription,
            longDescription: exercise.longDescription,
            editorPrompt: exercise.editorPrompt,
            testCode: exercise.testCode,
            category: exercise.category,
            difficulty: exercise.difficulty,
            gameStartTime: gameStartTime,
            winner: null,
            isPractice: true
        };
        var roomKey = rooms.push(roomData).key();
        return roomKey;
    };

    factory.deleteActiveRoom = function(roomKey) {
        var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + roomKey);
        ref.remove();
    }

    factory.updateActiveRoomData = function () {
        return $q(function(resolve, reject) {
            var activeRoomData = [];
            var ref = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms/');
            ref.once('value', function (firebaseSnapshot){
                for (var key in firebaseSnapshot.val()){
                    var roomData = firebaseSnapshot.val()[key];
                    roomData.roomId = key;
                    if (roomData.gameStartTime > Date.now() )
                    // don't put closed rooms (timed out) on scope for now
                        activeRoomData.push(roomData);
                };
                resolve(activeRoomData);
            });
        });
    };

    factory.addUserToRoom = function (userObj, roomId) {
        var ref = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms/'+roomId);
        var list = [];
        ref.once('value', function (snap){
            list = snap.val().users;
            list.push(userObj);
            ref.child('users').set(list);
        });
    };

    factory.removeUserFromRoom = function (userId, roomId) {
        var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+roomId);
        var userlist = [];
        ref.once('value', function (snap){
            userlist = snap.val().users;
            if (userlist.length == 1){
                ref.remove();
                return;
            }
            userlist.forEach (function (user, index) {
                if (userId == user._id){
                    userlist.splice(index,1);
                };
            });
            ref.child('users').set(userlist);
        });
    };

    return factory;

});
