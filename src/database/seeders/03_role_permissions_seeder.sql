TRUNCATE role_permissions RESTART IDENTITY CASCADE;

-- IT Manager (full access)
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Assets
(1, 1), (1, 2), (1, 3),
-- Categories
(1, 4), (1, 5), (1, 6),
-- Requests
(1, 7), (1, 8), (1, 9),
-- Transfers
(1, 10), (1, 11), (1, 12),
-- Employees
(1, 13), (1, 14), (1, 15),
-- Campuses
(1, 16), (1, 17), (1, 18),
-- Reports
(1, 19),
-- Users
(1, 20), (1, 21), (1, 22),
-- Roles
(1, 23), (1, 24), (1, 25);

-- IT Staff (no approvals)
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Assets
(2, 1), (2, 2), (2, 3),
-- Categories
(2, 4), (2, 5), (2, 6),
-- Requests (view/add only)
(2, 7), (2, 8),
-- Transfers (view/add only)
(2, 10), (2, 11),
-- Employees
(2, 13), (2, 14), (2, 15),
-- Campuses
(2, 16), (2, 17), (2, 18),
-- Reports
(2, 19),
-- Users
(2, 20), (2, 21), (2, 22),
-- Roles
(2, 23), (2, 24), (2, 25);

-- IT Auditor (read-only)
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Assets
(3, 1),
-- Categories
(3, 4),
-- Requests
(3, 7),
-- Transfers
(3, 10),
-- Employees
(3, 13),
-- Campuses
(3, 16),
-- Reports
(3, 19),
-- Users
(3, 20),
-- Roles
(3, 23);

-- Employee (basic submit + tracking)
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Assets (view)
(4, 1),
-- Requests (view/add)
(4, 7), (4, 8);
