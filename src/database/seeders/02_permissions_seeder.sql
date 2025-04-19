TRUNCATE permissions RESTART IDENTITY CASCADE;

INSERT INTO permissions (id, name, description) VALUES
(1, 'view_assets', 'View asset listings and details'),
(2, 'modify_assets', 'Create, update or delete assets'),
(3, 'approve_requests', 'Approve or reject asset requests'),
(4, 'submit_requests', 'Submit asset request'),
(5, 'assign_assets', 'Assign assets to employees'),
(6, 'view_reports', 'Access reports module')
ON CONFLICT (id) DO NOTHING;