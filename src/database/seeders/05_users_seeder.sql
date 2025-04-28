TRUNCATE users RESTART IDENTITY CASCADE;

-- Pass: @Temp123

INSERT INTO users (employee_id, email, password_hash, status, last_login, created_at, updated_at) VALUES
(1, 'manager@ub.edu.bz', '$2b$12$HgyebhV39IvhfHD0jlZcO.8pWwv3e26x9z1URE49XN.bP.td79Y2C', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'staff@ub.edu.bz', '$2b$12$HgyebhV39IvhfHD0jlZcO.8pWwv3e26x9z1URE49XN.bP.td79Y2C', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'auditor@ub.edu.bz', '$2b$12$HgyebhV39IvhfHD0jlZcO.8pWwv3e26x9z1URE49XN.bP.td79Y2C', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'employee@ub.edu.bz', '$2b$12$HgyebhV39IvhfHD0jlZcO.8pWwv3e26x9z1URE49XN.bP.td79Y2C', 'Active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

TRUNCATE user_roles RESTART IDENTITY CASCADE;

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);