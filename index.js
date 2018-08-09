// Import dependencies
const express = require('express');
const morgan = require('morgan');
const app = express();

// Settings
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
app.use(express.static('public'));

// Middleware
app.use(morgan('dev'));
// Routes

// Init server
app.listen(app.get('port'), () => {
    console.log(`Server started in ${app.get('port')}...'`);
});