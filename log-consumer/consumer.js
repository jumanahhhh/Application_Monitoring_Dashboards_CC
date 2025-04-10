const kafka = require("kafka-node");
const { Client } = require("pg");

const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
const consumer = new kafka.Consumer(
  client,
  [{ topic: "logs", partition: 0 }],
  { autoCommit: true }
);

const db = new Client({
  host: "postgres",
  user: "user",
  password: "password",
  database: "monitoring",
  port: 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error:", err.stack));

  consumer.on("message", async (message) => {
    try {
      const log = JSON.parse(message.value);
      console.log("Consumed log object:", log);
  
      if (!log.endpoint || !log.method) {
        console.warn("Malformed log:", log);
        return;
      }
  
      const query = `
        INSERT INTO logs (timestamp, endpoint, method, status, response_time_ms, payload)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [
        log.timestamp,
        log.endpoint,
        log.method,
        log.status,
        log.response_time_ms,
        log.payload
      ];
  
      console.log("Inserting log with values:", values);
      await db.query(query, values);
      console.log(" Log saved to DB");
    } catch (err) {
      console.error(" Error saving log:", err);
    }
  });
  
