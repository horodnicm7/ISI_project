const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Serve static files middleware
app.use(express.static('public'))

// Routes
app.use('/', require('./routes/index.js'));

app.listen(80, () => console.log('Server started on port 80'));
