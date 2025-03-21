export default {
    apps: [{
      name: 'ramen-crypto',
      script: './service/startup/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }]
  }