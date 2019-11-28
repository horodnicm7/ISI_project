const express = require('express');
const router = express.Router();
const path = require('path');


// Welcome Page
router.get('/', (req, res) => {

    console.log("GET index.html");
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

module.exports = router;
