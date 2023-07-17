DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, phone TEXT, createdAt TEXT, updatedAt TEXT);
INSERT INTO users (id, username, password, phone, createdAt, updatedAt) VALUES (1, 'admin', 'admin', '09123456788', '2019-01-01 00:00:00', '2019-01-01 00:00:00');