const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const kafkaProducer = require("./kafka/producer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/status", (req, res) => {
  res.json({ status: "API is running" });
});

// Accept data and send logs to Kafka
app.post("/data", (req, res) => {
  const logData = {
    timestamp: new Date().toISOString(),
    endpoint: "/data",
    method: "POST",
    status: 200,
    response_time_ms: Math.floor(Math.random() * 200) + 50,
    payload: req.body,
  };

  kafkaProducer.sendLog(logData);

  res.status(200).json({ message: "Log sent to Kafka", logData });
});

// Existing
app.post('/data', (req, res) => {
  sendLog('/data', 'POST', 200, req.body);
  res.status(200).json({ message: 'Data received' });
});

// 🆕 Add these endpoints

app.get('/status', (req, res) => {
  sendLog('/status', 'GET', 200, {});
  res.status(200).json({ status: 'ok' });
});

app.post('/login', (req, res) => {
  sendLog('/login', 'POST', 200, req.body);
  res.status(200).json({ message: 'Login successful' });
});

app.get('/metrics', (req, res) => {
  sendLog('/metrics', 'GET', 200, {});
  res.status(200).json({ uptime: process.uptime(), memoryUsage: process.memoryUsage() });
});

app.get('/users', (req, res) => {
  sendLog('/users', 'GET', 200, {});
  res.status(200).json({ users: ['User1', 'User2', 'User3'] });
});


// Fetch logs (simulated for now)
app.get("/logs", (req, res) => {
  res.json({ message: "Logs will be retrieved from the database in Week 2" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
