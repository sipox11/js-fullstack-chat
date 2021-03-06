const Chat = require('./models/Chat');

module.exports = function(io) {
    
    let users = {

    };

    io.on('connection', async socket => {
        console.log('New client connected!');

        let messages = await Chat.find().sort({ created_at: -1 }).limit(10);
        console.log('Old messages successfully retrieved!');
        socket.emit('old_msgs', messages);

        // Handle incoming messages
        socket.on('send_message', async (data, callback) => {
            console.log('Data received: ', data);
            // Process message looking for special commands
            let cleanData = data.trim();
            if(cleanData.substr(0,3) === '/w ') {
                cleanData = cleanData.substr(3);
                let index = cleanData.indexOf(' ');
                if( index !== -1) {
                    let name = cleanData.substr(0, index);
                    cleanData = cleanData.substr(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            message: cleanData,
                            nickname: socket.nickname
                        });
                        users[socket.nickname].emit('whisper', {
                            message: cleanData,
                            nickname: socket.nickname
                        });
                    } else {
                        callback('ERROR! Please enter a valid user');
                    }
                } else {
                    callback('ERROR! Please enter your message!');
                }
            } else {
                // Save msg to DB
                let newMessage = new Chat({
                    message: data,
                    nickname: socket.nickname
                });

                await newMessage.save();
                console.log('Data successfully saved!');

                // Retransmit a message to all sockets
                let msg = {
                    message: data,
                    nickname: socket.nickname
                };
                io.sockets.emit('new_message', msg);
            }
        });

        // Handle nickname registration
        socket.on('new_user', (data, callback) => {
            console.log('New nickname registration received: ', data);
            if(data in users) {
                // User does exist
                callback(false);
            } else {
                // User does not exist
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
            }
            console.log('Broadcasting usernames: ', users);
            updateNicknames();
        });

        // Handle user disconnection
        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname]
            updateNicknames();
        });

        
    });

    function updateNicknames () {
        io.sockets.emit('broadcast_usernames', Object.keys(users));
    }
};