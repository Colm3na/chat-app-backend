const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secrets');

module.exports = function(io, _) {
    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        
        // verify token
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if(err) return next(err);
            // set the user’s mongodb _id to the socket for future use
            socket._id = decoded.data._id;
            next();
        });
    });
    
    var userArray = [];
    
    io.on('connection', (socket) => {
        console.log('User connected', socket.id);
           
        socket
            .on('new message', data => {
                console.log(data);
                io.emit('receive message', data);
            })

            .on('typing', data => {
                let timer = 5;        
                console.log('--------->>' + data.sender, 'is typing');
                    
                if ( data.val === true ) {
                    socket.broadcast.emit('receive typing', {sender: data.sender, val: true});
                } else {
                  if ( timer <= 0 ) {
                    socket.broadcast.emit('receive typing', {val: false});
                  } else {
                    setTimeout(() => {timer = 0; socket.broadcast.emit('receive typing', {val: false})}, 1500);
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

            .on('disconnect', () => {
                console.log('/////////////////////////////////////////////////////////////FIRST', userArray.length);
                let id = socket._id;
                userArray = userArray.filter(socket => socket.id !== id);
                console.log('/////////////////////////////////////////////////////////////SECOND', userArray.length);
                console.log(socket._id, 'has been disconnected');

                io.emit('usersOnline', userArray);
            })
    })
}