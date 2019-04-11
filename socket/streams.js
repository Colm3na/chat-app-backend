const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secrets');

module.exports = function(io, _) {

    var userArray = [];

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        
        // verify token
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if(err) return next(err);
            // set the user’s mongodb _id to the socket for future use
            socket.id = decoded.data._id;
            socket.name = decoded.data.username;
            next();
        });
    });
    
    io.on('connection', socket => {
        console.log('User connected', socket.name, socket.id);
        socket.join(socket.name);
        io.of('/').in(socket.name).clients(function(error, clients){
            console.log(clients);
            var numClients = clients.length;
            console.log(`There are ${numClients} users in ${socket.name} room`);
        });

        socket
            .on('new message', data => {
                io.to(data.receiver).emit('receive message', data);
                socket.broadcast.to(data.receiver).emit('read message', { id: data.id, sender: data.sender });
            })

            .on('typing', data => {
                let timer = 5;        
                if ( data.val === true ) {
                    socket.broadcast.to(data.receiver).emit('receive typing', {sender: data.sender, val: true});
                } else {
                  if ( timer <= 0 ) {
                    socket.broadcast.to(data.receiver).emit('receive typing', {val: false});
                  } else {
                    setTimeout(() => {timer = 0; socket.broadcast.to(data.receiver).emit('receive typing', {sender: data.sender, val: false})}, 1500);
                  }
                }
            })

            .on('online', data => {
                console.log('--------->userArray in online event', userArray);

                const user = { name: data.user, id: data.userId };
                userArray.push(user);
                console.log('--------->userArray after push', userArray);
                // remove duplicates
                userArray = _.uniqBy( userArray, 'id' );
                console.log('--------->userArray after uniq', userArray);

                io.emit('usersOnline', userArray);
            })

            .on('enter chat', data => {
                console.log('enter chat event. Room', data);
                socket.join(data);
                io.of('/').in(data).clients(function(error, clients){
                    console.log(clients);
                    var numClients = clients.length;
                    console.log(`There are ${numClients} users in ${data} room`);
                });
                io.emit('entered chat');
            })

            .on('disconnect', () => {
                console.log('/////////////////////////////////////////////////////////////FIRST', userArray.length);
                let id = socket._id;
                userArray = userArray.filter(socket => socket.id !== id);
                console.log('/////////////////////////////////////////////////////////////SECOND', userArray.length);
                console.log(socket.id, 'has been disconnected');

                io.emit('usersOnline', userArray);
            })
    })
}