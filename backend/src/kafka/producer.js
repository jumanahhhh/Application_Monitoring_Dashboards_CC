const kafka = require("kafka-node");

function createKafkaClient(retries = 5, delay = 5000) {
  let client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });

  client.on("error", (err) => {
    console.error("Kafka connection error:", err.message);
    if (retries > 0) {
      console.log(`Retrying Kafka connection in ${delay / 1000} seconds...`);
      setTimeout(() => createKafkaClient(retries - 1, delay), delay);
    } else {
      console.error("Kafka is not available. Check if Kafka is running.");
    }
  });

  return client;
}

const client = createKafkaClient();

const producer = new kafka.Producer(client);

producer.on("ready", () => {
  console.log("Kafka Producer is connected and ready.");
});

producer.on("error", (err) => {
  console.error("Kafka Producer error:", err);
});

function sendLog(logData) {
  const payloads = [{ topic: "logs", messages: JSON.stringify(logData), partition: 0 }];

  producer.send(payloads, (err, data) => {
    if (err) console.error("Error sending log:", err);
    else console.log("Log sent:", data);
  });
}

module.exports = { sendLog };
