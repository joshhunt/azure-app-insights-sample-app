// This generates fake requests to the server to send data to Azure
const axios = require("axios");

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// github rate limiting info:
// 5000 req/hour
// ~1.38 req/second

const MAX_REQUESTS_PER_SECOND = 1.2;

function curve(x) {
  return (Math.sin(2 * Math.PI * (x - 1 / 4)) + 1) / 2;
}

function getCurrentSecond() {
  const now = new Date();
  return now.getSeconds() + 60 * now.getMinutes() + 60 * 60 * now.getHours();
}

const DAY_IN_SECONDS = 86400;

function request() {
  const currentSeconds = getCurrentSecond();
  const dayProgress = currentSeconds / DAY_IN_SECONDS;
  const requestPerSecond = Math.max(
    MAX_REQUESTS_PER_SECOND * curve(dayProgress),
    0.5
  );

  const delay = Math.floor(1000 / requestPerSecond + random(-10, 10));

  console.log(
    "Targeting",
    requestPerSecond,
    "requests per second, delay",
    delay,
    "ms"
  );

  setTimeout(() => {
    axios
      .get("http://localhost:3001/github/grafana/grafana/commits")
      .catch((err) => console.error("Request error:", err.message));

    request();
  }, delay);
}

request();
