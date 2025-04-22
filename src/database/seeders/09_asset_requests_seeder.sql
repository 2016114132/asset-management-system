INSERT INTO asset_requests (request_type, asset_id, description, status, requested_by, submitted_at)
VALUES
  ('New', NULL, 'Request for a new MacBook Pro for software development.', 'Pending', 1, CURRENT_TIMESTAMP),
  ('New', NULL, 'Request for additional projector for classroom 3B.', 'Approved', 2, CURRENT_TIMESTAMP),
  ('Replacement', 1, 'Laptop is too slow, requesting a newer model.', 'Pending', 3, CURRENT_TIMESTAMP),
  ('Repair', 2, 'Printer is jamming paper frequently.', 'Pending', 1, CURRENT_TIMESTAMP),
  ('Repair', 3, 'Camera lens not focusing properly.', 'Approved', 4, CURRENT_TIMESTAMP),
  ('Disposal', 4, 'Smart Board no longer functional and out of warranty.', 'Denied', 2, CURRENT_TIMESTAMP),
  ('Disposal', 5, 'MacBook Pro battery swollen and damaged.', 'Pending', 4, CURRENT_TIMESTAMP);
