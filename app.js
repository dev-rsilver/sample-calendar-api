var calendarAPI = require('./calendar-api');
var dotenv = require('dotenv');
var path = require('path');

//Configure environment variables
var config = dotenv.config();

if(config.error) {
    throw new Error("Error loading root .env");
}

//Configure environment variables in .env file located at SECRETS_PATH if SECRETS_PATH supplied
var secretsPath = process.env.SECRETS_PATH;

if(secretsPath !== undefined) {
    var secureConfig = dotenv.config({ path:  path.normalize(secretsPath) });
    if(secureConfig.error) {
        throw new Error("Error loading secure .env");
    }
}

//Configure application
var app = new calendarAPI.calendarAPI();
module.exports = app;
