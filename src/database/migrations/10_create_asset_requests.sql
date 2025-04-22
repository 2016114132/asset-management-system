CREATE TABLE IF NOT EXISTS asset_requests (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(20) NOT NULL, -- New, Replacement, Repair, Disposal
  asset_id INT REFERENCES assets(id) ON DELETE SET NULL, -- nullable for New requests
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Denied
  requested_by INT REFERENCES employees(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
