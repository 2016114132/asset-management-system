CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_tag VARCHAR(100) UNIQUE,
  name VARCHAR(150),
  category_id INT REFERENCES categories(id),
  campus_id INT REFERENCES campuses(id),
  condition VARCHAR(20),
  status VARCHAR(20) DEFAULT 'Available',
  purchase_date DATE,
  assigned_to INT REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);