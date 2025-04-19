TRUNCATE employees RESTART IDENTITY CASCADE;

INSERT INTO employees (id, employee_code, first_name, last_name, email, department, status, created_at, updated_at) VALUES
(1, 'EMP001', 'Alice', 'Manager', 'manager@example.com', 'ICT', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'EMP002', 'Bob', 'Staff', 'staff@example.com', 'ICT', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'EMP003', 'Carol', 'Auditor', 'auditor@example.com', 'Audit', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'EMP004', 'Dave', 'Employee', 'employee@example.com', 'Library', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;