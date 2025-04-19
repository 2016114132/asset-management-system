TRUNCATE roles RESTART IDENTITY CASCADE;

INSERT INTO roles (id, name, description) VALUES
(1, 'IT Manager', 'Full system access including approvals, transfers, and reporting.'),
(2, 'IT Staff', 'Access to everything except approvals.'),
(3, 'IT Auditor', 'Read-only access for auditing.'),
(4, 'Employee', 'Submit and track asset requests.')
ON CONFLICT (id) DO NOTHING;