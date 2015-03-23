app.factory('RoomFactory', function ($firebaseObject) {

        var rooms = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms');

        var activeRooms = [];

        var createRoom = function(exercise, user) {
            console.log('these are the rooms:', rooms);
            // console.log('this is the user: ', user);
            var roomData = {
                users: user
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
        };
        //very similar ( or same function?) for createPractice
        return {
            createRoom: createRoom
        };

    });
