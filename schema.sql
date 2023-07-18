DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, phone TEXT, createdAt TEXT, updatedAt TEXT, role INTEGER);
INSERT INTO users (id, username, password, phone, createdAt, updatedAt, role) VALUES (1, 'admin', 'da023f7090dd831097f8a534475b1c4fba2a9a6419968e52be7459e2533ac819', '09123456788', '2019-01-01 00:00:00', '2019-01-01 00:00:00', 1);

DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, createdAt TEXT, updatedAt TEXT);
INSERT INTO roles (id, name, createdAt, updatedAt) VALUES (1, 'student', '2019-01-01 00:00:00', '2019-01-01 00:00:00'), (2, 'teacher', '2019-01-01 00:00:00', '2019-01-01 00:00:00');