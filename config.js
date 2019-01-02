/*
 * Create and export configuration variables
 * 
 * Run: NODE_ENV=staging node index.js
 * 
 *  --> If needed, to run on Windows: 
 * 1: SET NODE_ENV=staging   2: node index.js  */

// Container for all the environments
var envs = {};

// Staging, the default environment
envs.staging = {
  'httpPort' : 3030,
  'httpsPort' : 3031,
  'envName' : 'staging'
};


// Production environment
envs.production = {
  'httpPort' : 5030,
  'httpsPort' : 5031,
  'envName' : 'production'
};

// Determine wich environment was passed as a command-line argument
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var envToExport = typeof(envs[currentEnv]) == 'object' ? envs[currentEnv] : envs.staging;

// Export the module
module.exports = envToExport;
