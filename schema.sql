DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, createdAt TEXT, updatedAt TEXT);
INSERT INTO users (id, username, password, createdAt, updatedAt) VALUES (1, 'admin', 'admin', '2019-01-01 00:00:00', '2019-01-01 00:00:00');