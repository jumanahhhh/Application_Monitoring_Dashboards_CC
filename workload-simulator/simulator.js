const axios = require("axios");

const endpoints = [
  { method: 'POST', path: '/data', payload: () => ({ user: getRandomUser() }) },
  { method: 'POST', path: '/login', payload: () => ({ username: getRandomUser(), password: 'secret' }) },
  { method: 'GET', path: '/status', payload: () => null },
  { method: 'GET', path: '/metrics', payload: () => null },
  { method: 'GET', path: '/users', payload: () => null }
];

function getRandomUser() {
  return `User${Math.floor(Math.random() * 100)}`;
}

function sendRandomRequest() {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const url = `http://backend:8000${endpoint.path}`;

  const start = Date.now();

  axios({
    method: endpoint.method,
    url: url,
    data: endpoint.payload() || {}
  })
    .then(response => {
      const responseTime = Date.now() - start;
      console.log("Simulated request sent:", {
        message: "Log sent to Kafka",
        logData: {
          timestamp: new Date().toISOString(),
          endpoint: endpoint.path,
          method: endpoint.method,
          status: response.status,
          response_time_ms: responseTime,
          payload: endpoint.payload() || {}
        }
      });
    })
    .catch(err => {
      console.error("Simulation error:", err.message);
    });
}

// Send a request every 2-5 seconds randomly
setInterval(sendRandomRequest, Math.floor(Math.random() * 3000) + 2000);

