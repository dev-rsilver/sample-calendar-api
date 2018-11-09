var express = require('express');
var logger = require('morgan');
var path = require('path');
var helmet = require('helmet');
var env = require("./environment");

this.calendarAPI = function() {

    var environment = new env.environment();

    function configureEnvironmentVariables() {
        //Specify and validate environment variables.
        environment.configureEnvironmentVariables([
            new env.environmentVariableMetadata("hsts", "int", true, "Indicates number of seconds for which HSTS headers are valid."),
            new env.environmentVariableMetadata("enable_http", "bool", false, "Enables HTTP. Enabled by default."),
            new env.environmentVariableMetadata("ip_address", "string", false, "Sets ip address on which the server listens. Defaults to 'localhost'."),
         ]);
    }

    function configureSecurity() {

        var enableHSTS = environment.getEnvironmentVariable("HSTS") > 0 ? true : false;

        var hsts = false;

        if(enableHSTS) {
            hsts = { 
                maxAge: environment.getEnvironmentVariable("HSTS"),
                includeSubdomains: true
            };
        } else {
            //HSTS header, once issued and not expired, must be cancelled via maxAge 0 over HTTPS before HTTP access can resume.
            hsts = {
                maxAge: 0,
                includeSubdomains: true
            }
        }

        app.use(helmet({
            hsts: hsts
        }));

        var handlers = [];

        //Add handlers here.

        if(handlers.length > 0) {
            app.use(handlers);
        }


    }

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
    
    configureEnvironmentVariables();
    configureSecurity(app);
    configureSerializers(app);
    configureStaticFiles(app);
    configureRouters(app);
    
    return app;
}