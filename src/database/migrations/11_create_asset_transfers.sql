CREATE TABLE IF NOT EXISTS asset_transfers (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  from_campus_id INT REFERENCES campuses(id),
  to_campus_id INT REFERENCES campuses(id),
  requested_by INT REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'Pending',
  transfer_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);