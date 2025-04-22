CREATE TABLE IF NOT EXISTS asset_transfers (
  id SERIAL PRIMARY KEY,
  asset_id INT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  from_campus_id INT NOT NULL REFERENCES campuses(id),
  to_campus_id INT NOT NULL REFERENCES campuses(id),
  from_employee_id INT REFERENCES employees(id),
  to_employee_id INT REFERENCES employees(id),
  reason TEXT NOT NULL,
  transferred_by INT NOT NULL REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'Pending',
  transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
