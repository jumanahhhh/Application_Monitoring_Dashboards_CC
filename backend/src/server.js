const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendLog } = require("./kafka/producer");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

function buildLog(endpoint, method, status, payload) {
  return {
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    status,
    response_time_ms: Math.floor(Math.random() * 200) + 50,
    payload
  };
}

// POST /data
app.post("/data", async (req, res) => {
  const log = buildLog("/data", "POST", 200, req.body);
  await sendLog(log);
  res.status(200).json({ message: "Log sent to Kafka", log });
});

// POST /login
app.post("/login", async (req, res) => {
  const log = buildLog("/login", "POST", 200, req.body);
  await sendLog(log);
  res.status(200).json({ message: "Login successful" });
});

// GET /status
app.get("/status", async (req, res) => {
  const log = buildLog("/status", "GET", 200, {});
  await sendLog(log);
  res.status(200).json({ status: "ok" });
});

// GET /metrics
app.get("/metrics", async (req, res) => {
  const log = buildLog("/metrics", "GET", 200, {});
  await sendLog(log);
  res.status(200).json({ uptime: process.uptime(), memoryUsage: process.memoryUsage() });
});

// GET /users
app.get("/users", async (req, res) => {
  const log = buildLog("/users", "GET", 200, {});
  await sendLog(log);
  res.status(200).json({ users: ["User1", "User2", "User3"] });
});

// Optional: View placeholder logs route
app.get("/logs", (req, res) => {
  res.json({ message: "Logs will be retrieved from the database in Week 2" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
