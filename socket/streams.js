module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('button', () => {
            console.log('even sent')
            socket.emit('event', {
                message: 'button has been pressed'
            })
        })
    })
}