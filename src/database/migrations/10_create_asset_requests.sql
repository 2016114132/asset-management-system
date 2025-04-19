CREATE TABLE IF NOT EXISTS asset_requests (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(20),
  employee_id INT REFERENCES employees(id),
  asset_id INT REFERENCES assets(id),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);