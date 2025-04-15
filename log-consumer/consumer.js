const { Kafka } = require('kafkajs');
const { Client } = require('pg');

const kafka = new Kafka({
  clientId: 'log-consumer',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'log-consumer-group' });

const db = new Client({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'monitoring'
});

async function start() {
  try {
    await db.connect();
    console.log('Connected to PostgreSQL');

    await consumer.connect();
    console.log('Connected to Kafka');

    await consumer.subscribe({ topic: 'logs', fromBeginning: true });
    console.log('Subscribed to logs topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const log = JSON.parse(message.value.toString());
          console.log('Consumed log:', log);

          const query = `
            INSERT INTO logs (timestamp, level, message, service, metadata)
            VALUES ($1, $2, $3, $4, $5)
          `;
          const values = [
            log.timestamp,
            'INFO',
            `${log.method} ${log.endpoint} - ${log.status} (${log.response_time_ms}ms)`,
            'backend',
            JSON.stringify(log)
          ];

          await db.query(query, values);
          console.log('Log saved to database');
        } catch (err) {
          console.error('Error processing message:', err);
        }
      }
    });
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

start();
  
