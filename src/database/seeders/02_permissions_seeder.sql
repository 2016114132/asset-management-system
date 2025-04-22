TRUNCATE permissions RESTART IDENTITY CASCADE;

INSERT INTO permissions (name, description, module) VALUES
-- Assets
('view-assets', 'View asset listings', 'assets'),
('add-assets', 'Add new assets', 'assets'),
('modify-assets', 'Edit or update assets', 'assets'),

-- Categories
('view-categories', 'View categories', 'categories'),
('add-categories', 'Add new categories', 'categories'),
('modify-categories', 'Modify existing categories', 'categories'),

-- Requests
('view-requests', 'View asset requests', 'requests'),
('add-requests', 'Submit new asset requests', 'requests'),
('requests-approval', 'Approve or deny asset requests', 'requests'),

-- Transfers
('view-transfers', 'View asset transfers', 'transfers'),
('add-transfers', 'Initiate new transfers', 'transfers'),
('transfers-approval', 'Approve or deny transfers', 'transfers'),

-- Employees
('view-employees', 'View employee profiles', 'employees'),
('add-employees', 'Add new employees', 'employees'),
('modify-employees', 'Edit or update employee records', 'employees'),

-- Campuses
('view-campuses', 'View campuses', 'campuses'),
('add-campuses', 'Add new campuses', 'campuses'),
('modify-campuses', 'Edit campus details', 'campuses'),

-- Reports
('generate-reports', 'Generate system reports', 'reports'),

-- Users
('view-users', 'View system users', 'users'),
('add-users', 'Add new users', 'users'),
('modify-users', 'Modify user details', 'users'),

-- Roles
('view-roles', 'View roles and permissions', 'roles'),
('add-roles', 'Create new roles', 'roles'),
('modify-roles', 'Modify roles and assigned permissions', 'roles');
