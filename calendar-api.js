var express = require('express');
var logger = require('morgan');
var path = require('path');
var helmet = require('helmet');
var env = require("./environment");
var passport = require("passport");
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;
var auth = require('./core/authentication.js');

this.calendarAPI = function() {

    var environment = new env.environment();

    function configureEnvironmentVariables() {
        //Specify and validate environment variables.
        environment.configureEnvironmentVariables([
            new env.environmentVariableMetadata("hsts", "int", true, "Indicates number of seconds for which HSTS headers are valid."),
            new env.environmentVariableMetadata("enable_http", "bool", false, "Enables HTTP. Enabled by default."),
            new env.environmentVariableMetadata("ip_address", "string", false, "Sets ip address on which the server listens. Defaults to 'localhost'."),
            new env.environmentVariableMetadata("jwt_secret", "string", true, "The symmetric secret used to sign JWTs."),
            new env.environmentVariableMetadata("jwt_expiration_in_seconds", "int", true, "Indicates number of seconds for which JWTs are valid."),
         ]);
    }

    function configureSecurity(app) {

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

        //Set up JWT authentication
        configureAuthentication(app);

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

    function configureAuthentication(app) {
        //Initialize authentication framework.
        app.use(passport.initialize());

        //Authenicate via JWT. In a production application, it might be preferable to store the symmetric secret in an encrypted
        //manner or utilize asymmetric cryptography instead, and to address other issues such as key rotation.
        passport.use(new jwtStrategy({
            jwtFromRequest: jwtExtractor.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.getEnvironmentVariable("jwt_secret")
        }, function(jwt, done) {
            //Called if an auth header is extracted.
            var authentication = new auth.authentication();
            if(authentication.isJWTValid(jwt)) {

                var user = authentication.getUserById(jwt.id);
                if(user === undefined) {
                    throw new Error("User does not exist.");
                }

                return done(null, { userId:user.userId, userName:user.userName });
            }

            return done(null, false);
        }));
    }

    function configureRouters(app) {
        
        var tokenRouter = require('./routes/token');
        app.use("/token", tokenRouter);

        //Authenticated API router.
        var apiRouter = require('./routes/api');
        app.use("/api", passport.authenticate('jwt', { session: false }));
        app.use("/api", apiRouter);
    }
    
    var app = express(); //public variable, for module.exports
    
    configureEnvironmentVariables(app);
    configureSecurity(app);
    configureSerializers(app);
    configureStaticFiles(app);
    configureRouters(app);
    
    return app;
}