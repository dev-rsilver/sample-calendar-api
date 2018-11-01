var express = require('express');
var logger = require('morgan');
var path = require('path');

this.calendarAPI = function() {

    function configureSerializers(app) {
        app.use(express.json());
    }

    function configureStaticFiles(app) {
        app.use(express.static(path.join(__dirname, 'public')));
    }

    function configureLogging(app) {
        app.use(logger('dev'));
    }

    function configureRouters(app) {
        var indexRouter = require('./routes/index');
        app.use("/", indexRouter);
    }
    
    var app = express(); //public variable, for module.exports
    
    configureSerializers(app);
    configureStaticFiles(app);
    configureRouters(app);
    
    return app;
}