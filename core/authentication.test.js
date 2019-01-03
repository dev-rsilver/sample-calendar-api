
/* Sample tests follow. In a production application, tests could be more comprehensive. */

var app = require('../app'); //require app so that certain environment variables are loaded
var auth = require('./authentication');

test("gets user by username", () => {
    var authentication = new auth.authentication();
    var user = authentication.getUser(process.env.DEMO_USER_USERNAME);
    expect(user).not.toBeUndefined();
});

test("gets user by id", () => {
    var authentication = new auth.authentication();
    var user = authentication.getUserById(process.env.DEMO_USER_ID);
    expect(user).not.toBeUndefined();
});

test("successfully signs in", () => {
    var authentication = new auth.authentication();

    var signIn = new Promise((resolve) => {
        authentication.signIn(process.env.DEMO_USER_USERNAME, process.env.DEMO_USER_PASSWORD,
            () => {
                resolve("success");
            });    
    });

    return expect(signIn).resolves.toEqual("success");
});

test("unsuccessfully signs in", () => {
    var authentication = new auth.authentication();

    //Pass an incorrect password.

    var signIn = new Promise((resolve, reject) => {
        authentication.signIn(process.env.DEMO_USER_USERNAME, process.env.DEMO_USER_PASSWORD + "a",
            () => {
                //success callback
                resolve("success");
            },
            () => {
                //failure callback
                reject("failure");
            });    
    });

    return expect(signIn).rejects.toEqual("failure");
});

