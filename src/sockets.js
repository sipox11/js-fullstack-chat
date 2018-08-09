module.exports  = function(io) {
    io.on('connection', socket => {
        console.log('New client connected!');

        // Handle incoming messages
        socket.on('send_message', data => {
            console.log('Data received: ', data);
            // Retransmit a message to all sockets
            io.sockets.emit('new_message', data);
        });
    });
};