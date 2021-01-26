const appInsightsClient = require("./setupAppInsights"); // must be first

const os = require("os");
const express = require("express");

const { createLogger, format, transports } = require("winston");

const { Octokit } = require("@octokit/core");

const app = express();
app.set("trust proxy", true);

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "github-test-data" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

const wait = (delay) => {
  appInsightsClient.trackTrace({ message: `waiting ${delay} ms` });
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

app.get("/trace", (req, res) => {
  appInsightsClient.trackPageView();
  const clientIP = req.ip;
  console.log(`testing from trace route ${clientIP}`);
  appInsightsClient.trackTrace({
    message: `testing from trace route ${clientIP}`,
  });
  appInsightsClient.flush();
  res.send("tracing..." + clientIP);
});

app.get("/github/:owner/:repo/commits", (req, res, next) => {
  const shouldError = Math.random() < 0.03;

  const repo = shouldError
    ? `${req.params.repo}-repo-that-doesnt-exist`
    : req.params.repo;

  wait(random(100, 1000))
    .then(() =>
      octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: req.params.owner,
        repo: repo,
      })
    )
    .then((resp) => {
      logger.info("github commits rate limiting info", {
        limit: resp.headers["x-ratelimit-limit"],
        remaining: resp.headers["x-ratelimit-remaining"],
        reset: resp.headers["x-ratelimit-reset"],
        used: resp.headers["x-ratelimit-used"],
      });
      res.json(resp.data);
    })
    .catch(next);
});

app.get("/", function (req, res) {
  const clientIP = req.headers["x-forwarded-for"];
  res.send(`Hello World from host ${os.hostname()}, ${clientIP}!`);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Hello world app listening on port 3000!");
});
