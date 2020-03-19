const path = require("path");

const workingPath = (sub)=>{
  return path.join(process.cwd(),sub);
};

const dbenvironments = {
  dev: {
    port: 6603,
    username: 'noderestapi',
    password: 'noderestapi'
  },
  staging: {
    port: 6603,
    username: 'noderestapi',
    password: 'noderestapi'
  },
  // This should use environment variables for production
  production: {
    port: 6603,
    username: 'noderestapi',
    password: 'noderestapi'
  }
};

const environments = {
  local: {
    port: 3000,
    env: 'localdev'
  },
  dev: {
    port: 3000,
    https: {
      port: 3001,
      key: workingPath('https/key.pem'),
      cert: workingPath('https/cert.pem'),
      keycert: workingPath('https/key.cert')
    },
    db: dbenvironments.dev,
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
    db: dbenvironments.staging,
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
    db: dbenvironments.production,
    env: 'prod'
  }
};


const env = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'local';

/**
 * @type {environments.dev|{port, https, env}}
 */
const currentEnv = typeof(environments[env]) !== "undefined" ? environments[env] : environments.local;

module.exports = currentEnv;