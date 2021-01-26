// This generates fake requests to the server to send data to Azure
const axios = require("axios");

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// github rate limiting info:
// 5000 req/hour
// ~1.38 req/second

function request() {
  const delay = random(500, 1000);

  console.log("waiting", delay, "ms");
  setTimeout(() => {
    console.log("requesting...");
    axios.get("http://localhost:3001/github/grafana/grafana/commits");

    request();
  }, delay);
}

request();
