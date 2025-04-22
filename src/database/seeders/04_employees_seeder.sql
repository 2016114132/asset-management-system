TRUNCATE employees RESTART IDENTITY CASCADE;

INSERT INTO employees (employee_code, first_name, last_name, email, department, status, created_at, updated_at) VALUES
('EMP-00001', 'Alice', 'Thorne', 'manager@ub.edu.bz', 'ICT', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EMP-00002', 'Bob', 'Winslow', 'staff@ub.edu.bz', 'ICT', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EMP-00003', 'Carol', 'Ashford', 'auditor@ub.edu.bz', 'Audit', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EMP-00004', 'Dave', 'Carver', 'employee@ub.edu.bz', 'Library', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
