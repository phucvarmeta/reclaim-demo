module.exports = {
  apps: [
    {
      name: "reclaim-demo-frontend",
      script: "serve",
      env: {
        PM2_SERVE_PATH: './build',
        PM2_SERVE_PORT: 3010,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      }
    }
  ]
};