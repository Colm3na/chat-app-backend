module.exports = function(io) {
    let globalArray = [];
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('new message', (data) => {
            console.log(data);
        })

        socket.on('online', data => {
            console.log(data)
            socket.join(data.room);
            const user = { id: socket.id, name: data.user, room: data.room, _id: data.userId };
            globalArray.push(user);
            const roomName = globalArray.filter(user => user.room === data.room);
            const list = roomName.map( function(user) { return [user.name, user._id] });
            // remove duplicates
            const uniqueList = list.map(JSON.stringify).reverse().filter(function (e, i, a) {
                return a.indexOf(e, i+1) === -1;
            }).reverse().map(JSON.parse) 

            io.emit('usersOnline', uniqueList);
        });

        socket.on('disconnect', () => {
            console.log('disconnect fired');
        })
    })
}