/* Sample tests follow. In a production application, tests could be more comprehensive. */

var env = require('./environment');

test('sets variable', () => {

    //Tests that variable is obtained from process.env.

    var environment = new env.environment();

    process.env["variable1"] = "a test value";

    environment.configureEnvironmentVariables([
        new env.environmentVariableMetadata("variable1", "string", false, "A variable")
    ]);
    
    var variable = environment.getEnvironmentVariable("variable1");

    expect(variable).toBe("a test value");

    variable = environment.getEnvironmentVariable("variable2");

    expect(variable).toBeUndefined();
});

test('requires value', () => {

    //Tests that a required environment variable throws an error if a value cannot
    //be obtained. Note that this test uses an undefined environment variable.

    var environment = new env.environment();

    expect(() => environment.configureEnvironmentVariables([
        new env.environmentVariableMetadata("undefined_variable", "string", true, "A variable")
    ])).toThrow();

});

test('parses an int', () => {

    //Tests that an integer is properly parsed.

    var environment = new env.environment();

    process.env["int_variable"] = "11";

    environment.configureEnvironmentVariables([
        new env.environmentVariableMetadata("int_variable", "int", false, "An integer")
    ]);

    var value = environment.getEnvironmentVariable("int_variable");

    expect(value).toBe(11);

});

test('fails to parse a non-integer value', () => {

    //Tests that a variable that is specified as an integer, but which has a value that
    //is not an integer, is not parsed.

    var environment = new env.environment();

    process.env["variable1"] = "a test value";

    expect(() => environment.configureEnvironmentVariables([
        new env.environmentVariableMetadata("variable1", "int", false, "An integer")
    ])).toThrow();
});

