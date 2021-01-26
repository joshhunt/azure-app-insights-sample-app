module.exports = {
  apps: [
    {
      name: "azure-github-test-data-server",
      cron_restart: "*/30 * * * *", // restart every 30 minutes
      script: "./server.js",
    },
    {
      name: "azure-github-test-data-traffic-generator",
      cron_restart: "*/30 * * * *", // restart every 30 minutes
      script: "./generateTraffic.js",
    },
  ],
};
