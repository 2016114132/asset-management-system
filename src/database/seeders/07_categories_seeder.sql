TRUNCATE categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Laptop', 'Portable personal computers assigned to staff or faculty', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Desktop', 'Fixed personal computers used in labs and offices', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Projector', 'Devices used for presentations and lectures', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Printer', 'Printers for office and departmental use', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Scanner', 'Devices used to digitize paper documents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Router', 'Networking devices for managing internet and LAN connections', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Monitor', 'External displays for desktops or dual-screen setups', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Keyboard', 'Input devices used with desktops or servers', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mouse', 'Pointing devices for computers', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Server', 'High-performance machines used for hosting services', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
