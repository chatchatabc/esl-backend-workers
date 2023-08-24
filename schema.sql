/*
 * User Entity
 * One-to-one relationship with teachers table
 * One-to-many relationship with bookings table
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
 * One-to-many relationship with bookings table
 * Many-to-many relationship with courses table
 */
DROP TABLE IF EXISTS teachers;

CREATE TABLE
  IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL UNIQUE,
    alias TEXT NOT NULL,
    bio TEXT,
    status INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  teachers (userId, alias, bio, status, createdAt, updatedAt)
VALUES
  (3, 'Teacher Michelle', 'I am a teacher', 1, 0, 0);

/*
 * Course Entity
 * Many-to-many relationship with teachers table
 */
DROP TABLE IF EXISTS courses;

CREATE TABLE
  IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    price INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  courses (price, name, description, createdAt, updatedAt)
VALUES
  (50, 'Normal Class', 'Normal Class', 0, 0);

/*
 * Teacher Course Entity
 * Join table for teachers and courses
 */
DROP TABLE IF EXISTS teachersCourses;

CREATE TABLE
  IF NOT EXISTS teachersCourses (
    id INTEGER PRIMARY KEY,
    teacherId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  teachersCourses (teacherId, courseId, createdAt, updatedAt)
VALUES
  (1, 1, 0, 0);

/*
 * Role Entity
 * One-to-many relationship with users table
 */
DROP TABLE IF EXISTS roles;

CREATE TABLE
  IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
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
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

/*
 * Booking Entity
 * Many-to-one relationship with users table
 * Many-to-one relationship with teachers table
 * Many-to-one relationship with courses table
 */
DROP TABLE IF EXISTS bookings;

CREATE TABLE
  IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    courseId INTEGER NOT NULL,
    teacherId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    end TIMESTAMP NOT NULL,
    status INTEGER NOT NULL,
    message TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

/*
 * Credit Entity
 * Many-to-one relationship with users table
 */
DROP TABLE IF EXISTS logsCredit;

CREATE TABLE
  IF NOT EXISTS logsCredit (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    amount INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

/*
 * Message Entity
 * Many-to-one relationship with users table
 */
DROP TABLE IF EXISTS messages;

CREATE TABLE
  IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    cron TEXT NOT NULL,
    sendAt TIMESTAMP,
    status INTEGER NOT NULL, -- 0: inactive, 1: active, 2: successful, 3: failed, -1: deleted
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

/*
 * Message Template Entity
 * Independent entity for storing message templates
 */
DROP TABLE IF EXISTS messageTemplates;

CREATE TABLE
  IF NOT EXISTS messageTemplates (
    id INTEGER PRIMARY KEY,
    signature TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status INTEGER NOT NULL, -- 1: active, -1: deleted
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  messageTemplates (
    title,
    message,
    status,
    signature,
    createdAt,
    updatedAt
  )
VALUES
  (
    'Phone Verification',
    '您的手机验证码是123456，有效期仅5分钟。',
    1,
    '恰恰英语',
    0,
    0
  ),
  (
    'Class Reminder',
    '您好！您的课程于2023/08/23 14:00开始，请提前*分钟登陆您的账号，感谢您的支持',
    1,
    '恰恰英语',
    0,
    0
  );