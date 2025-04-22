INSERT INTO asset_transfers (
  asset_id, from_campus_id, to_campus_id,
  from_employee_id, to_employee_id, reason,
  transferred_by, transferred_at, status
)
VALUES 
  (1, 1, 2, 1, 2, 'Reassigned due to department change.', 3, CURRENT_TIMESTAMP, 'Transferred'),
  (2, 1, 1, 2, 4, 'Replacing assigned user.', 1, CURRENT_TIMESTAMP, 'Pending'),
  (3, 2, 3, 3, 1, 'Camera sent to PG campus for training.', 2, CURRENT_TIMESTAMP, 'Rejected'),
  (4, 3, 1, NULL, 4, 'New assignment after technician joined.', 3, CURRENT_TIMESTAMP, 'Transferred'),
  (5, 1, 1, 4, NULL, 'Unassigned MacBook for audit.', 2, CURRENT_TIMESTAMP, 'Pending');
