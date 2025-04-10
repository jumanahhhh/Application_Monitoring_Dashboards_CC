CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP,
  endpoint TEXT,
  method TEXT,
  status INTEGER,
  response_time_ms INTEGER,
  payload JSONB
);
