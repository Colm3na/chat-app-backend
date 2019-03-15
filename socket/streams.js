module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('new message', (data) => {
            console.log(data);
        })
    })
}