module.exports = {
    apps : [{
      name: "HCServer",
      script: "/www/prod/build/index.js",
      env: {
        NODE_ENV: "dev",
      },
      env_production: {
        NODE_ENV: "prod",
      }
    }]
  }