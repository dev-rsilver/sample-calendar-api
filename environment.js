
environmentVariableMetadata = function(name, type, required, description) {

    this.name = name;

    switch(type) {
        case "int":
        case "bool":
        case "string": break;
        default: throw new Error("Unexpected type.");
    }

    this.type = type;

    if(typeof required !== "boolean")
        throw new Error("Expected boolean.");

    this.required = required;
    this.description = description;



 
}

/**
 * Environment class 
 */
environment = function() {

    environmentVariables = [];

    this.getEnvironmentVariable = function(name) {
        return environmentVariables[name.toLowerCase()];
    }

    /**
     * Validates environment variables
     * envs: environmentVariableMetadata[]
     */
    this.configureEnvironmentVariables = function(envs) {

        if(!Array.isArray(envs)) {
            throw new Error("environmentVariables: expected array.");
        }

        
        //The application may depend on the presence of certain configuration flags. Ensure that those flags are present in the environment
        //variables.
        let errorMessage = "";

        envs.forEach((value) => { 
            
            if(!(value instanceof environmentVariableMetadata)) throw new Error("Expected an environmentVariableMetadata object."); 

            actualVariable = process.env[value.name.toUpperCase()];
            
            //If the variable is required, ensure it's present.
            if(value.required) {
                if(actualVariable === undefined) {
                  errorMessage += `Missing environment variable '${value.name}', expected type: ${value.type}, description: '${value.description}'\n`;
                }
            }

            //If the variable is present, check its type.
            if(actualVariable !== undefined) {
                let typeCheckError = false;
              
                switch(value.type.toLowerCase()) {
                  case "int": 
                    if(isNaN(parseInt(actualVariable, 10))) {
                        typeCheckError = true;
                    } else { 
                        actualVariable = parseInt(actualVariable, 10);
                    }

                      break;
                  case "bool": 
                    switch(actualVariable.toLowerCase()) {
                        case "true":
                        actualVariable = true;
                        break;
                        case "false":
                        actualVariable = false;
                        break;
                        default:
                        typeCheckError = true;
                    }

                    break;
                  case "string":
                    break;
                  default:
                      throw new Error("Unexpected 'type' in metadata describing expected environment variables.");
                }

                if(typeCheckError) {
                  errorMessage += `Environment variable '${value.name}' failed type check, expected type: ${value.type}, description: '${value.description}'\n`;
                }
            }

            if(errorMessage.length <= 0) {
                environmentVariables[value.name.toLowerCase()] = actualVariable;
            }

        });

        if(errorMessage.length > 0)
            throw new Error(errorMessage);
    }

    this.isDevelopmentEnvironment = function() {
        if(process.env.NODE_ENV === undefined) {
            return true;
        }
        return false;
    }


}

module.exports.environment = environment;
module.exports.environmentVariableMetadata = environmentVariableMetadata;