TRUNCATE campuses RESTART IDENTITY CASCADE;

INSERT INTO campuses (name, location, created_at, updated_at) VALUES
('Central Campus (Belmopan)', 'Belmopan, Cayo District', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Central Farm Campus', 'Central Farm, Cayo District', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Faculty of Management and Social Sciences (FMSS)', 'West Landivar, Belize City', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Faculty of Education & Health Sciences', 'Belize City', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Punta Gorda Campus', 'Punta Gorda, Toledo District', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
