CREATE TABLE IF NOT EXISTS campuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);