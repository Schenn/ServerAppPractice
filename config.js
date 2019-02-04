const path = require("path");

const workingPath = (sub)=>{
  return path.join(process.cwd(),sub);
};

const environments = {
  dev: {
    port: 3000,
    https: {
      port: 3001,
      key: workingPath('https/key.pem'),
      cert: workingPath('https/cert.pem'),
      keycert: workingPath('https/key.cert')
    },
    env: 'dev',
  },
  staging: {
    port: 5000,
    https: {
      port: 5001,
      key: workingPath('https/key.pem'),
      cert: workingPath('https/cert.pem'),
      keycert: workingPath('https/key.cert')
    },
    env: 'staging'
  },
  production: {
    port: 80,
    https: {
      port: 443,
      key: workingPath('https/key.pem'),
      cert: workingPath('https/cert.pem'),
      keycert: workingPath('https/key.cert')
    },
    env: 'prod'
  }
};


const env = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'dev';

/**
 * @type {environments.dev|{port, https, env}}
 */
const currentEnv = typeof(environments[env]) !== "undefined" ? environments[env] : environments.dev;

module.exports = currentEnv;