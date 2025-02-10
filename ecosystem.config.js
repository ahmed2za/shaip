module.exports = {
  apps: [
    {
      name: 'reviews-platform',
      script: 'npm',
      args: 'start',
      cwd: './client',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
