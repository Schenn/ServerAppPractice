let environments = {
  dev: {
    port: 3000,
    env: 'dev'
  },
  staging: {
    port: 5000,
    env: 'staging'
  },
  production: {
    port: 80,
    env: 'prod'
  }
};


let env = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'dev';
let currentEnv = typeof(environments[env]) !== "undefined" ? environments[env] : environments.dev;

module.exports = currentEnv;