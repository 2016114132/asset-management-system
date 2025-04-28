TRUNCATE roles RESTART IDENTITY CASCADE;

INSERT INTO roles (name, description) VALUES
('IT Manager', 'Full system access including approvals, transfers, and reporting.'),
('IT Staff', 'Access to everything except approvals.'),
('IT Auditor', 'Read-only access for auditing.'),
('Employee', 'Submit and track asset requests.');