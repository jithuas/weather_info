const express = require('express');
const path = require('path');
const weather = require('./router');
require('dotenv').config()

/**
 * Express APP
 */
const app = express()

/**
 * Expose static webpage
 */
app.use(express.static(path.join(__dirname, '/../assets')))
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/../assets/index.html`)
});

/**
 * Expose weather APIs
 */
app.use('/weather', weather)

/**
 * Export express app
 */
module.exports = app