'use strict'
app.factory('RoomFactory', function($firebaseObject, $q) {

    var factory = {}

    var rooms = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms');

    factory.activeRooms = [];

    factory.createRoom = function(exercise, user) {
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
            winner: null

        };
        var roomKey = rooms.push(roomData).key();
        factory.activeRooms.push(roomKey);
        

        return roomKey;
        //fetches the exercise from the DB (or get from exercise obj)
        //creates a room with that user in it
        //adds the room to FB
        //has a route to that room (for other users)
        //^ /arena/(exercise) [one exercise at a time]
        //^ /arena/(fb id)
    }; // closes createRoom function
    //very similar ( or same function?) for createPractice

    factory.deleteActiveRoom = function(roomKey) {
        var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + roomKey);
        ref.remove();
    }

    factory.updateActiveRoomData = function () {
        return $q(function(resolve, reject) {
            var activeRoomData = [];
            var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/');
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
        var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+roomId);
        var list = [];
        ref.once('value', function (snap){
            list = snap.val().users;
            list.push(userObj);
            ref.child('users').set(list);
        });
    };

    return factory;

});
