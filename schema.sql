/*
 * User Entity
 * One-to-one relationship with teachers table
 * Many-to-one relationship with roles table
 */
DROP TABLE IF EXISTS users;

CREATE TABLE
  IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    roleId INTEGER NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    firstName TEXT,
    lastName TEXT,
    alias TEXT,
    phoneVerifiedAt TIMESTAMP,
    emailVerifiedAt TIMESTAMP,
    credits INTEGER NOT NULL,
    status INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  users (
    roleId, -- 1: admin, 2: student, 3: teacher
    username,
    password,
    phone,
    firstName,
    lastName,
    alias,
    phoneVerifiedAt,
    credits,
    status, -- 1: active, 2: inactive, -1: deleted
    createdAt,
    updatedAt
  )
VALUES
  (
    1,
    'admin',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+639338520220',
    'Bon Jovi',
    'Montes',
    'SuperAdmin',
    0,
    1000,
    1,
    0,
    0
  ),
  (
    2,
    'student',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+8618832258785',
    'Joy',
    'Liu',
    'JoyGwapo',
    0,
    1000,
    1,
    0,
    0
  ),
  (
    3,
    'teacher',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+8618832258785',
    'Michele',
    'Surname',
    'Teacher Michelle',
    0,
    1000,
    1,
    0,
    0
  );

/*
 * Teacher Entity
 * One-to-one relationship with users table
 * One-to-many relationship with schedules table
 */
DROP TABLE IF EXISTS teachers;

CREATE TABLE
  IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL UNIQUE,
    alias TEXT NOT NULL,
    bio TEXT,
    status INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

INSERT INTO
  teachers (userId, alias, bio, status, createdAt, updatedAt)
VALUES
  (3, 'Teacher Michelle', 'I am a teacher', 1, 0, 0);

/*
 * Role Entity
 * One-to-many relationship with users table
 */
DROP TABLE IF EXISTS roles;

CREATE TABLE
  IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

INSERT INTO
  roles (name, createdAt, updatedAt)
VALUES
  ('admin', 0, 0),
  ('student', 0, 0),
  ('teacher', 0, 0);

/*
 * Schedule Entity
 * Many-to-one relationship with teachers table
 */
DROP TABLE IF EXISTS schedules;

CREATE TABLE
  IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY,
    teacherId INTEGER NOT NULL,
    startTime INTEGER NOT NULL,
    endTime INTEGER NOT NULL,
    day INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

/**
 * id (integer)
 * historyCredit (uuid)
 * teacherId (integer)
 * studentId (integer)
 * start (timestamp)
 * end (timestamp)
 * status (integer) [0:pending, 1: active, 2: finished, 3: cancelled, 4: absent, -1: deleted]
 * message (text)
 * createdAt (timestamp)
 * updatedAt (timestamp)
 */
DROP TABLE IF EXISTS bookings;

CREATE TABLE
  IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    historyCreditUuid TEXT UNIQUE NOT NULL,
    teacherId INTEGER NOT NULL,
    studentId INTEGER,
    start INTEGER NOT NULL,
    end INTEGER NOT NULL,
    status INTEGER NOT NULL,
    message TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

/**
 * id (integer)
 * senderId (integer)
 * receiverId (integer)
 * amount (integer)
 * status (integer) [1: pending, 2: finished, 3: cancelled, -1: deleted]
 * createdAt (timestamp)
 * updatedAt (timestamp)
 */
DROP TABLE IF EXISTS logsCredit;

CREATE TABLE
  IF NOT EXISTS logsCredit (
    id INTEGER PRIMARY KEY,
    uuid TEXT UNIQUE NOT NULL,
    title TEXT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    status INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

/**
 * id (integer)
 * title (text)
 * senderId (integer)
 * receiverId (integer)
 * message (text)
 * cron (text)
 * sendAt (timestamp?)
 * status (integer) [1: active, 2: finished, 3: failed, 4: cancelled, -1: deleted]
 * createdAt (timestamp)
 * updatedAt (timestamp)
 */
DROP TABLE IF EXISTS messages;

CREATE TABLE
  IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    message TEXT NOT NULL,
    cron TEXT NOT NULL,
    sendAt INTEGER,
    status INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

INSERT INTO
  messages (
    title,
    senderId,
    receiverId,
    message,
    cron,
    sendAt,
    status,
    createdAt,
    updatedAt
  )
VALUES
  (
    'Phone Verification',
    1,
    2,
    '您的手机验证码是#code#，有效期仅5分钟。',
    '10 * * * *',
    1691735400000,
    1,
    0,
    0
  );

/**
 * id (integer)
 * smsId (integer) [From SMS api]
 * signature (text)
 * title (text)
 * message (text)
 * status (integer) [1: pending, 2: accepted, 3: rejected, -1: deleted]
 * createdAt (timestamp)
 * updatedAt (timestamp)
 */
DROP TABLE IF EXISTS messageTemplates;

CREATE TABLE
  IF NOT EXISTS messageTemplates (
    id INTEGER PRIMARY KEY,
    smsId INTEGER UNIQUE NOT NULL,
    signature TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

INSERT INTO
  messageTemplates (
    title,
    message,
    status,
    signature,
    smsId,
    createdAt,
    updatedAt
  )
VALUES
  (
    'Phone Verification',
    '您的手机验证码是#code#，有效期仅5分钟。',
    2,
    '恰恰英语',
    5332,
    0,
    0
  ),
  (
    'Class Reminder',
    '你好！您的课程安排在#date#，时间是#time#。我们将专注于口语练习。请准时到达，以充分利用本次课程。到时见！',
    2,
    '恰恰英语',
    5359,
    0,
    0
  );