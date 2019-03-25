module.exports = function(io, _) {
    var userArray = [];
    
    io.on('connection', (socket) => {
        console.log('User connected');

        socket            
            .on('new message', (data) => {
                console.log(data);
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
                console.log('disconnect fired');
                console.log('/////////////////////////////////////////////////////////////FIRST', userArray.length);
                let id = socket._id;
                userArray = userArray.filter(socket => socket.id !== id);
                
                console.log('/////////////////////////////////////////////////////////////SECOND', userArray.length);
                console.log(socket._id, 'has been disconnected');

                io.emit('usersOnline', userArray);
            })
    })
}