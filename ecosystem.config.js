module.exports = {
  apps: [
    {
      name: 'sl-blog',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '../logs/err.log',
      out_file: '../logs/out.log',
      log_file: '../logs/combined.log',
      time: true
    }
  ]
};
