const appInsights = require("applicationinsights");

appInsights
  .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY || "no-key-provided")
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(true)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
  .start();

const client = appInsights.defaultClient;

module.exports = client;
