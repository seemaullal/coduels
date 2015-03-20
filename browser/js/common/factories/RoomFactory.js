app.factory('RoomFactory', function ($firebaseObject) {
        var createRoom = function(exercise, user) {
            //fetches the exercise from the DB (or get from exercise obj)
            //creates a room with that user in it
            //adds the room to FB
            //has a route to that room (for other users)
                //^ /arena/(exercise) [one exercise at a time]
                //^ /arena/(fb id)
        }

        //very similar ( or same function?) for createPractice
        return {
            
        };
    });