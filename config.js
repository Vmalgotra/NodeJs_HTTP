/*
Create and export configuration variables
*/

// Container for all the environments
var environments = {};

// Staging default environment

environments.staging = {
    'port': 3000,
    'envName': 'staging'
};

environments.production = {
    'port': 5000,
    'envName': 'production'
};

var currentEnvironment = typeof(process.env.Node_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

console.log(process.env.Node_ENV);
var environmentToExport = typeof(environments[currentEnvironment]) ==='object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;

