module.exports = function(io, _) {
    let globalArray = [];
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('new message', (data) => {
            console.log(data);
        })

        socket.on('online', data => {
            socket.join(data.room);
            const user = { id: socket.id, name: data.user, room: data.room };
            globalArray.push(user);
            const roomName = globalArray.filter(user => user.room === data.room);
            const list = roomName.map(user => user.name);
            console.log(_.uniq(list))
            io.emit('usersOnline', _.uniq(list));
        });
    })
}