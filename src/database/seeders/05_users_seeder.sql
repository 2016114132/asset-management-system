TRUNCATE users RESTART IDENTITY CASCADE;

-- Dummy bcrypt hashes, replace in production
INSERT INTO users (id, employee_id, email, password_hash, status, last_login, created_at, updated_at) VALUES
(1, 1, 'manager@ub.edu.bz', '$2y$10$dummyhash1', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'staff@ub.edu.bz', '$2y$10$dummyhash2', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'auditor@ub.edu.bz', '$2y$10$dummyhash3', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, 'employee@ub.edu.bz', '$2y$10$dummyhash4', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

TRUNCATE user_roles RESTART IDENTITY CASCADE;

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);