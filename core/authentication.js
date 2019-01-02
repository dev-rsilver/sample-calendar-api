var crypto = require('crypto');
var jwt = require('jsonwebtoken');


//Holds information regarding users. This userStore is only meant for demo purposes. In a production application, users 
//could be saved in a persistent data store and their passwords would be hashed utilizing a cryptographic library.
var userStore = [];

authentication = function(opts) {

    /* Demo application has a single user, with username located in process.env.DEMO_USER_USERNAME,
     * password in process.env.DEMO_USER_PASSWORD, and id located in process.env.DEMO_USER_ID.
     */

    if(process.env.DEMO_USER_USERNAME === undefined)
        throw new Error("Environment variable DEMO_USER_USERNAME is required.");

    if(process.env.DEMO_USER_PASSWORD === undefined)
        throw new Error("Environment variable DEMO_USER_PASSWORD is required.");

    if(process.env.DEMO_USER_ID === undefined)
        throw new Error("Environment variable DEMO_USER_ID is required.");


    //Initial population of userStore.
    if(userStore.length <= 0) {
        userStore.push({
            userName: process.env.DEMO_USER_USERNAME,
    
            /** 
             * Tokens issued after and including the date are valid. Tokens issued before are invalid. This enables
             * features such as forced logout after a password change or sign out.
             * */
            tokensValidFrom: new Date().getTime(),
    
            userId: process.env.DEMO_USER_ID
        });
    }
    

    /**
     * Returns a user or undefined if no user is found. Does not authenticate user.
     * To authenticate, see signInUser(). This module does not require that the user 
     * be identified via an email address, so the application calling this function is 
     * responsible for requiring email addresses if desired.
     */
    this.getUser = function(userName) {
        return getUser(userName);
    }
    
    
    function getUser(userName) {
        userName = userName.toLowerCase();
        
        for(var i = 0; i < userStore.length; i++) {
            if(userStore[i].userName.toLowerCase() === userName) {
                return userStore[i];
            }
        }
        
        return undefined;
    }

    /**
     * Returns a user or undefined if no user is found. Does not authenticate user.
     * To authenticate, see signInUser().
     */
    this.getUserById = function(userId) {
        return getUserById(userId);
    }

    function getUserById(userId) {
        userId = userId.toLowerCase();

        for(var i = 0; i < userStore.length; i++) {
            if(userStore[i].userId.toLowerCase() === userId) {
                return userStore[i];
            }
        }

        return undefined;
    }

    /**
     * Signs out a user.
     */
    this.signOut = function(userId) {
        var user = getUserById(userId);
        if(user === undefined) {
            //User may have been deleted.
            throw new Error("User does not exist.");
        }

        user.tokensValidFrom = new Date().getTime();
    }

    /**
     * Authenticates a user.
     * If signin succeeds, successCallback will be called with a JWT as the first argument.
     * If signin fails, failureCallback will be called with no arguments.
     * 
     * Recommended usage:
     * var auth = require('authentication.js');
     * var authentication = new auth.authentication();
     * authentication.signIn(email, password, (jwt) => { }, () => { });
     * 
     * This module does not require that the user be identified via an email address, so
     * the application calling this function is responsible for requiring email addresses.
     */
    this.signIn = function(username, password, successCallback, failureCallback) {

        if(successCallback !== undefined && typeof successCallback !== "function")
            throw new Error("successCallback must be a function.");

        if(failureCallback !== undefined && typeof failureCallback !== "function")
            throw new Error("failureCallback must be a function.");

        //Note: In a production application, should rate limit password attempts.

        if(isPasswordMatch(username, password)) {
            
            //Get the user to obtain the id.
            var user = getUser(username);

            if(user === undefined) {
                //User may have been deleted.
                throw new Error("User does not exist.");
            }
            
            //Return JWT    
            var jwt = issueJWT(user.userId);
            successCallback(jwt);
            return;
        }

        failureCallback();
    }

    /**
     * Returns true if password is a match or false otherwise.
     */
    function isPasswordMatch(username, password) {

        let expectedUsername = process.env.DEMO_USER_USERNAME;

        var user = getUser(username);
        
        if(user === undefined) {
            //User does not exist.
            return false;
        } else {
            //User exists, so check whether it's the user we're expecting.
            if(user.userName.toLowerCase() !== expectedUsername.toLowerCase()) {
                return false;
            }
        }

        //Note: In a production application, passwords would be hashed and compared via a 
        //cryptographic library.

        let expectedPassword = process.env.DEMO_USER_PASSWORD;

        if(password === expectedPassword) { //passwords are case-sensitive, so don't convert to lowercase
            return true;
        }

        return false;
    }

    /**
     * Issues a JWT with the given ID.
     */
    function issueJWT(id) {
        //In a production application, would prefer to store JWT_SECRET in an encrypted manner or use
        //asymmetric crypto for signing.
        var date = new Date().getTime();

        //Date is in milliseconds, so it's necessary to convert JWT_EXPIRATION_IN_SECONDS to milliseconds 
        var expiration = date + (parseInt(process.env.JWT_EXPIRATION_IN_SECONDS, 10) * 1000);
        
        return jwt.sign({ id: id, issued: date, expiration: expiration }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_IN_SECONDS + "s" });
    }

    /**
     * Given a JWT, determines whether the JWT is valid.
     */
    this.isJWTValid = function(jwt) {

        //Check that the user exists.
        var userId = jwt.id;

        var user = getUserById(userId);
        
        if(user === undefined) {
            //User may have been deleted
            throw new Error("User does not exist.");
        }

        if(jwt.issued >= user.tokensValidFrom) {
            return true;
        }

        return false;
    }
}

module.exports.authentication = authentication;