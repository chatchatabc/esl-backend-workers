/*
 * User Entity
 * One-to-one relationship with teachers table
 * One-to-one relationship with users table
 * One-to-many relationship with bookings table
 * Many-to-one relationship with roles table
 */
DROP TABLE IF EXISTS users;

CREATE TABLE
  IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    roleId INTEGER NOT NULL, -- 1: admin, 2: student, 3: teacher
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
    status INTEGER NOT NULL, -- 0: inactive, 1: active
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  users (
    roleId,
    username,
    password,
    phone,
    firstName,
    lastName,
    alias,
    phoneVerifiedAt,
    credits,
    status,
    createdById,
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
    1,
    0,
    0
  );

/*
 * Teacher Entity
 * One-to-one relationship with users table
 * One-to-many relationship with schedules table
 * One-to-many relationship with bookings table
 * one-to-many relationship with courses table
 */
DROP TABLE IF EXISTS teachers;

CREATE TABLE
  IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    userId INTEGER NOT NULL UNIQUE, -- Foreign key from users table
    alias TEXT,
    bio TEXT,
    status INTEGER NOT NULL, -- 0: inactive, 1: active
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  teachers (
    uuid,
    userId,
    alias,
    bio,
    status,
    createdById,
    createdAt,
    updatedAt
  )
VALUES
  (
    'teacher',
    3,
    'Teacher Michelle',
    'I am a teacher',
    1,
    1,
    0,
    0
  );

/*
 * Student Entity
 * One-to-one relationship with users table
 */
DROP TABLE IF EXISTS students;

CREATE TABLE
  IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    userId INTEGER NOT NULL UNIQUE, -- Foreign key from users table
    alias TEXT,
    bio TEXT,
    status INTEGER NOT NULL, -- 0: inactive, 1: active
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  students (
    uuid,
    userId,
    alias,
    bio,
    status,
    createdById,
    createdAt,
    updatedAt
  )
VALUES
  (
    'student',
    2,
    'JoyGwapo',
    'I am a student',
    1,
    1,
    0,
    0
  );

/*
 * Course Entity
 * Many-to-one relationship with teachers table
 */
DROP TABLE IF EXISTS courses;

CREATE TABLE
  IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    teacherId INTEGER NOT NULL, -- Foreign key from teachers table
    price INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status INTEGER NOT NULL, -- 0: inactive, 1: active
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  courses (
    uuid,
    teacherId,
    price,
    name,
    description,
    status,
    createdById,
    createdAt,
    updatedAt
  )
VALUES
  (
    'normal-class',
    1,
    50,
    'Normal Class',
    'Normal Class',
    1,
    1,
    0,
    0
  );

/*
 * Role Entity
 * One-to-many relationship with users table
 */
DROP TABLE IF EXISTS roles;

CREATE TABLE
  IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  roles (name, createdById, createdAt, updatedAt)
VALUES
  ('admin', 1, 0, 0),
  ('student', 1, 0, 0),
  ('teacher', 1, 0, 0);

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
    weekDay INTEGER NOT NULL,
    createdById INTEGER NOT NULL, -- Foreign key from users table
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
    uuid TEXT NOT NULL UNIQUE,
    courseId INTEGER NOT NULL, -- Foreign key from courses table
    teacherId INTEGER NOT NULL, -- Foreign key from teachers table
    studentId INTEGER NOT NULL, -- Foreign key from users table
    amount INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    end TIMESTAMP NOT NULL,
    status INTEGER NOT NULL, -- 1: pending, 2: confirmed, 3: completed, 4: cancelled, 5: absent, 6: expired, -1: deleted
    message TEXT,
    createdById INTEGER NOT NULL, -- Foreign key from users table
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
    userId INTEGER NOT NULL, -- Foreign key from users table
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    amount INTEGER NOT NULL,
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

/*
 * Fund Entity
 * Many-to-one relationship with users table
 */
DROP TABLE IF EXISTS funds;

CREATE TABLE
  IF NOT EXISTS funds (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    userId INTEGER NOT NULL, -- Foreign key from users table
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    credits INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status INTEGER NOT NULL, -- 1: pending, 2: confirmed, 3: completed, 4: cancelled
    createdById INTEGER NOT NULL, -- Foreign key from users table
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
    uuid TEXT NOT NULL UNIQUE,
    messageTemplateId INTEGER NOT NULL, -- Foreign key from messageTemplates table
    userId INTEGER, -- Foreign key from users table
    phone TEXT NOT NULL,
    templateValues TEXT,
    cron TEXT NOT NULL,
    sendAt TIMESTAMP,
    status INTEGER NOT NULL, -- 0: inactive, 1: scheduled, 2: successful, 3: failed, 4: recurring -1: deleted
    createdById INTEGER NOT NULL, -- Foreign key from users table
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
    smsId TEXT NOT NULL UNIQUE, -- ID from SMS service provider
    signature TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    variables TEXT, -- Separated by comma
    status INTEGER NOT NULL, -- 0: inactive, 1: active
    createdById INTEGER NOT NULL, -- Foreign key from users table
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  messageTemplates (
    smsId,
    signature,
    title,
    message,
    variables,
    status,
    createdById,
    createdAt,
    updatedAt
  )
VALUES
  (
    'SMS_462695548',
    '恰恰英语',
    'Class Reminder',
    '您好！您的课程于#datetime#开始，请提前分钟登陆您的账号，感谢您的支持',
    'datetime',
    1,
    1,
    0,
    0
  );