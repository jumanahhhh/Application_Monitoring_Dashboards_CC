const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'backend',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'kafka:9092']
});

const producer = kafka.producer();

async function connect() {
  try {
    await producer.connect();
    console.log('Kafka Producer is connected and ready.');
  } catch (err) {
    console.error('Error connecting to Kafka:', err);
    process.exit(1);
  }
}

async function sendLog(logData) {
  try {
    await producer.send({
      topic: 'logs',
      messages: [
        { value: JSON.stringify(logData) }
      ]
    });
    console.log('Log sent:', logData);
  } catch (err) {
    console.error('Error sending log:', err);
  }
}

connect();

module.exports = { sendLog };
