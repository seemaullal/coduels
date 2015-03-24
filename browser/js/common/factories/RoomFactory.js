app.factory('RoomFactory', function($firebaseObject) {

    var rooms = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms');

    var activeRooms = [];
    var gameStartTime = new Date();
    gameStartTime = gameStartTime.setMinutes(gameStartTime.getMinutes() + 2);
    var createRoom = function(exercise, user) {
        var roomData = {
            users: user,
            exerciseId: exercise._id,
            exerciseName: exercise.name,
            shortDescription: exercise.shortDescription,
            longDescription: exercise.longDescription,
            editorPrompt: exercise.editorPrompt,
            testCode: exercise.testCode,
            category: exercise.category,
            difficulty: exercise.difficulty,
            gameStartTime: gameStartTime

        };
        var roomKey = rooms.push(roomData).key();
        activeRooms.push(roomKey);
        return roomKey;
        //fetches the exercise from the DB (or get from exercise obj)
        //creates a room with that user in it
        //adds the room to FB
        //has a route to that room (for other users)
        //^ /arena/(exercise) [one exercise at a time]
        //^ /arena/(fb id)
    }; // closes createRoom function
    //very similar ( or same function?) for createPractice
    return {
        createRoom: createRoom
    };

});
