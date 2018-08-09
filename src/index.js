// Import dependencies
const express = require('express');
const morgan = require('morgan');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();


// Settings
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(morgan('dev'));

// Routes

// Set up websockets real time connection
const server = http.createServer(app);
const io =socketio.listen(server);

// Require and execute IO socket connection handling
require('./sockets')(io);


// Init server
server.listen(app.get('port'), () => {
    console.log(`Server started in ${app.get('port')}...'`);
});