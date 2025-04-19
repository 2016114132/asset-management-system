TRUNCATE role_permissions RESTART IDENTITY CASCADE;

-- IT Manager
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6);

-- IT Staff
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 1), (2, 2), (2, 4), (2, 5), (2, 6);

-- IT Auditor
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 1), (3, 6);

-- Employee
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 1), (4, 4);