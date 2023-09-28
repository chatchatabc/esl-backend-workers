PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

DROP TABLE IF EXISTS bookings;

DROP TABLE IF EXISTS courses;

DROP TABLE IF EXISTS logsCredit;

DROP TABLE IF EXISTS logsMoney;

DROP TABLE IF EXISTS messageSchedules;

DROP TABLE IF EXISTS messageTemplates;

DROP TABLE IF EXISTS messages;

DROP TABLE IF EXISTS roles;

DROP TABLE IF EXISTS schedules;

DROP TABLE IF EXISTS teachers;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS scheduledMessages;

DROP TABLE IF EXISTS teachersCourses;

DROP TABLE IF EXISTS d1_kv;

CREATE TABLE
  users (
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
    updatedAt TIMESTAMP NOT NULL,
    createdById INTEGER NOT NULL
  );

INSERT INTO
  users
VALUES
  (
    1,
    1,
    'admin',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+639338520220',
    NULL,
    'Bon Jovi',
    'Montes',
    'SuperAdmin',
    1694770006994,
    NULL,
    1000,
    1,
    0,
    1694770006994,
    1
  );

INSERT INTO
  users
VALUES
  (
    2,
    2,
    'student',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '18832258785',
    NULL,
    'Joy',
    'Liu',
    'JoyGwapo',
    1694999258191,
    NULL,
    1000,
    1,
    0,
    1694999258191,
    1
  );

INSERT INTO
  users
VALUES
  (
    3,
    3,
    'teacher',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '18832258785',
    NULL,
    'Michele',
    'Surname',
    'Teacher Michelle',
    1695113171219,
    NULL,
    1101,
    1,
    0,
    1695799393935,
    1
  );

INSERT INTO
  users
VALUES
  (
    4,
    2,
    '13805886076',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13805886076',
    NULL,
    'Jack',
    'Student',
    'Jack',
    1693447867561,
    NULL,
    90,
    1,
    1693447867565,
    1695798058456,
    1
  );

INSERT INTO
  users
VALUES
  (
    5,
    2,
    '13603010612',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13603010612',
    NULL,
    'Sophia',
    'Student',
    'Sophia',
    1693448395823,
    NULL,
    90,
    1,
    1693448395826,
    1695797870551,
    1
  );

INSERT INTO
  users
VALUES
  (
    6,
    2,
    '17839699129',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '17839699129',
    NULL,
    'Mark',
    'Student',
    'Mark',
    1693448417289,
    NULL,
    80,
    1,
    1693448417292,
    1695798100476,
    1
  );

INSERT INTO
  users
VALUES
  (
    7,
    2,
    '13588721376',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13588721376',
    NULL,
    'Dandan',
    'Student',
    'Dandan',
    1693448439354,
    NULL,
    171,
    1,
    1693448439356,
    1695799393935,
    1
  );

INSERT INTO
  users
VALUES
  (
    8,
    2,
    '13858291610',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13858291610',
    NULL,
    'He Muzhao',
    'Student',
    'He Muzhao',
    1693448472888,
    NULL,
    191,
    1,
    1693448472890,
    1695798007919,
    1
  );

INSERT INTO
  users
VALUES
  (
    9,
    2,
    '13922855650',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13922855650',
    NULL,
    'Xiaomei',
    'Student',
    'Xiaomei',
    1693448499781,
    NULL,
    182,
    1,
    1693448499783,
    1695798351331,
    1
  );

INSERT INTO
  users
VALUES
  (
    10,
    2,
    '13867854905',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13867854905',
    NULL,
    'Coco',
    'Student',
    'Coco',
    1693448523278,
    NULL,
    192,
    1,
    1693448523282,
    1695798072448,
    1
  );

INSERT INTO
  users
VALUES
  (
    11,
    2,
    '15888059252',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '15888059252',
    NULL,
    'Milly',
    'Student',
    'Milly',
    1693448544021,
    NULL,
    90,
    1,
    1693448544023,
    1695800902796,
    1
  );

INSERT INTO
  users
VALUES
  (
    12,
    2,
    '13738833278',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13738833278',
    NULL,
    'William',
    'Student',
    'William',
    1693448579568,
    NULL,
    191,
    1,
    1693448579571,
    1695798113328,
    1
  );

INSERT INTO
  users
VALUES
  (
    13,
    2,
    '13813862693',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13813862693',
    NULL,
    'Jim',
    'Student',
    'Jim',
    1693448605225,
    NULL,
    90,
    1,
    1693448605228,
    1695797939865,
    1
  );

INSERT INTO
  users
VALUES
  (
    14,
    2,
    '18805715320',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '18805715320',
    NULL,
    'Mila',
    'Student',
    'Mila',
    1693448627656,
    NULL,
    139,
    1,
    1693448627658,
    1695800882215,
    1
  );

INSERT INTO
  users
VALUES
  (
    15,
    2,
    '13605745372',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13605745372',
    NULL,
    'JackCen',
    'Student',
    'JackCen',
    1693465690923,
    NULL,
    0,
    1,
    1693465690968,
    1695798086478,
    1
  );

INSERT INTO
  users
VALUES
  (
    16,
    3,
    'Zendy',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '1234',
    NULL,
    'Zendy',
    'dela Cruz',
    'Zendy',
    1693533317675,
    NULL,
    10,
    1,
    1693533317703,
    1695720593831,
    1
  );

INSERT INTO
  users
VALUES
  (
    17,
    2,
    '15601333256',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '15601333256',
    NULL,
    'Ethan',
    'student',
    'Ethan',
    1693813328680,
    NULL,
    991,
    1,
    1693813328718,
    1695036335882,
    1
  );

INSERT INTO
  users
VALUES
  (
    18,
    2,
    '13957862109',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '13957862109',
    NULL,
    'Donnie',
    'Student',
    'Donnie',
    1694780273054,
    NULL,
    15,
    1,
    1694780273089,
    1694780688691,
    1
  );

CREATE TABLE
  teachers (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    userId INTEGER NOT NULL UNIQUE,
    alias TEXT NOT NULL,
    bio TEXT,
    status INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    createdById INTEGER NOT NULL
  );

INSERT INTO
  teachers
VALUES
  (
    1,
    '1',
    3,
    'Teacher Michelle',
    'I''m the kind of a teacher who is approachable and I can establish a rapport with my students . Since I was a child, I really want to become a teacher. I know deep in my core, that I''m meant to be in teaching field. In fact, I started teaching pre-school and elementary students after I passed the Licensure Examination for Teachers in 2014. Then I moved to Secondary School where I have been teaching English and Filipino (Tagalog) for six years.',
    1,
    0,
    1694746077843,
    1
  );

INSERT INTO
  teachers
VALUES
  (
    2,
    '2',
    16,
    'Teacher Zendy ',
    'Sample bio',
    1,
    1693533413814,
    1693533413814,
    1
  );

CREATE TABLE
  students (
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
  students
VALUES
  (
    1,
    'student',
    2,
    'JoyGwapo',
    NULL,
    1,
    1,
    1694999258191,
    1694999258191
  );

INSERT INTO
  students
VALUES
  (
    2,
    '13805886076',
    4,
    'Jack',
    NULL,
    1,
    1,
    1693447867565,
    1694569403532
  );

INSERT INTO
  students
VALUES
  (
    3,
    '13603010612',
    5,
    'Sophia',
    NULL,
    1,
    1,
    1693448395826,
    1693465508324
  );

INSERT INTO
  students
VALUES
  (
    4,
    '17839699129',
    6,
    'Mark',
    NULL,
    1,
    1,
    1693448417292,
    1695625195560
  );

INSERT INTO
  students
VALUES
  (
    5,
    '13588721376',
    7,
    'Dandan',
    NULL,
    1,
    1,
    1693448439356,
    1694568228989
  );

INSERT INTO
  students
VALUES
  (
    6,
    '13858291610',
    8,
    'He Muzhao',
    NULL,
    1,
    1,
    1693448472890,
    1693465523555
  );

INSERT INTO
  students
VALUES
  (
    7,
    '13922855650',
    9,
    'Xiaomei',
    NULL,
    1,
    1,
    1693448499783,
    1693465528987
  );

INSERT INTO
  students
VALUES
  (
    8,
    '13867854905',
    10,
    'Coco',
    NULL,
    1,
    1,
    1693448523282,
    1694678025083
  );

INSERT INTO
  students
VALUES
  (
    9,
    '15888059252',
    11,
    'Milly',
    NULL,
    1,
    1,
    1693448544023,
    1694253096993
  );

INSERT INTO
  students
VALUES
  (
    10,
    '13738833278',
    12,
    'William',
    NULL,
    1,
    1,
    1693448579571,
    1693465544097
  );

INSERT INTO
  students
VALUES
  (
    11,
    '13813862693',
    13,
    'Jim',
    NULL,
    1,
    1,
    1693448605228,
    1693465547356
  );

INSERT INTO
  students
VALUES
  (
    12,
    '18805715320',
    14,
    'Mila',
    NULL,
    1,
    1,
    1693448627658,
    1694140953778
  );

INSERT INTO
  students
VALUES
  (
    13,
    '13605745372',
    15,
    'JackCen',
    NULL,
    1,
    1,
    1693465690968,
    1693465908949
  );

INSERT INTO
  students
VALUES
  (
    14,
    '15601333256',
    17,
    'Ethan',
    NULL,
    1,
    1,
    1693813328718,
    1695036335882
  );

INSERT INTO
  students
VALUES
  (
    15,
    '13957862109',
    18,
    'Donnie',
    NULL,
    1,
    1,
    1694780273089,
    1694780688691
  );

CREATE TABLE
  courses (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    teacherId INTEGER NOT NULL,
    price INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  courses
VALUES
  (
    1,
    '1',
    1,
    1,
    'Normal Class',
    'Normal Class',
    1,
    0,
    1693448731564
  );

INSERT INTO
  courses
VALUES
  (
    2,
    '2',
    2,
    1,
    'Normal Class',
    'Normal class',
    1,
    1693533458134,
    1693533458134
  );

INSERT INTO
  courses
VALUES
  (
    3,
    '3',
    2,
    2,
    'Group Class',
    'Group Class',
    1,
    1693533470849,
    1693533738063
  );

CREATE TABLE
  roles (
    id INTEGER PRIMARY KEY,
    name TEXT,
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  roles
VALUES
  (1, 'admin', 1, 0, 0);

INSERT INTO
  roles
VALUES
  (2, 'student', 1, 0, 0);

INSERT INTO
  roles
VALUES
  (3, 'teacher', 1, 0, 0);

CREATE TABLE
  schedules (
    id INTEGER PRIMARY KEY,
    teacherId INTEGER NOT NULL,
    startTime INTEGER NOT NULL,
    endTime INTEGER NOT NULL,
    weekDay INTEGER NOT NULL,
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  schedules
VALUES
  (
    2,
    1,
    36000000,
    50400000,
    4,
    1,
    1693448887366,
    1694573055016
  );

INSERT INTO
  schedules
VALUES
  (
    4,
    1,
    36000000,
    50400000,
    1,
    1,
    1693449620274,
    1694573055016
  );

INSERT INTO
  schedules
VALUES
  (
    5,
    1,
    36000000,
    50400000,
    5,
    1,
    1693449620274,
    1694573055016
  );

INSERT INTO
  schedules
VALUES
  (
    6,
    1,
    36000000,
    50400000,
    6,
    1,
    1693449620274,
    1694573055016
  );

INSERT INTO
  schedules
VALUES
  (
    7,
    2,
    82800000,
    100800000,
    0,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    8,
    2,
    169200000,
    187200000,
    1,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    9,
    2,
    255600000,
    273600000,
    2,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    10,
    2,
    342000000,
    360000000,
    3,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    11,
    2,
    428400000,
    446400000,
    4,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    12,
    2,
    514800000,
    532800000,
    5,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    13,
    2,
    108000000,
    140400000,
    1,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    14,
    2,
    194400000,
    226800000,
    2,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    15,
    2,
    280800000,
    313200000,
    3,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    16,
    2,
    367200000,
    399600000,
    4,
    1,
    1693533642610,
    1693533661305
  );

INSERT INTO
  schedules
VALUES
  (
    17,
    2,
    453600000,
    486000000,
    5,
    1,
    1693533661587,
    1693533661587
  );

INSERT INTO
  schedules
VALUES
  (
    18,
    2,
    540000000,
    572400000,
    6,
    1,
    1693533661587,
    1693533661587
  );

INSERT INTO
  schedules
VALUES
  (
    19,
    2,
    21600000,
    54000000,
    0,
    1,
    1693533661587,
    1693533661587
  );

INSERT INTO
  schedules
VALUES
  (
    20,
    1,
    36000000,
    50400000,
    2,
    1,
    1694572763004,
    1694573055016
  );

INSERT INTO
  schedules
VALUES
  (
    21,
    1,
    36000000,
    50400000,
    3,
    1,
    1694573052299,
    1694573055016
  );

CREATE TABLE
  bookings (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    courseId INTEGER NOT NULL,
    teacherId INTEGER NOT NULL,
    studentId INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    end TIMESTAMP NOT NULL,
    status INTEGER NOT NULL, -- 1: pending, 2: confirmed, 3: completed, 4: cancelled, 5: absent, 6: expired, -1: deleted
    message TEXT,
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  bookings
VALUES
  (
    1,
    'e0b184ff-083b-4a74-9bb3-02497028edbc',
    1,
    1,
    3,
    1,
    1695808800000,
    1695810600000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    2,
    '4368e24c-f1ef-4db6-bd01-7a2ce71f33c6',
    1,
    1,
    3,
    1,
    1696413600000,
    1696415400000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    3,
    '8eee1fc1-60d0-4688-abe3-c4f11fae434d',
    1,
    1,
    3,
    1,
    1697018400000,
    1697020200000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    4,
    '8cc7693e-bdb6-40d4-bd32-a98881a8651d',
    1,
    1,
    3,
    1,
    1697623200000,
    1697625000000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    5,
    'e9607e0d-be20-4b38-aba8-4eec53f5fe8b',
    1,
    1,
    3,
    1,
    1698228000000,
    1698229800000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    6,
    '697435b3-6011-4449-b80e-79ff18c55403',
    1,
    1,
    3,
    1,
    1698832800000,
    1698834600000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    7,
    '5dd15272-f19f-4380-9c6a-c13e7a92a703',
    1,
    1,
    3,
    1,
    1699437600000,
    1699439400000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    8,
    '8930fd87-d0d9-44af-b733-37a6a4e8ff38',
    1,
    1,
    3,
    1,
    1700042400000,
    1700044200000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    9,
    'fb5397f5-4527-4441-8f6f-c0f6a94f6d9a',
    1,
    1,
    3,
    1,
    1700647200000,
    1700649000000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    10,
    '74a25676-b3c7-4d38-941e-19be6be15ad5',
    1,
    1,
    3,
    1,
    1701252000000,
    1701253800000,
    1,
    NULL,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  bookings
VALUES
  (
    11,
    '0050ccd0-5600-4563-acd1-31a404e60ac2',
    1,
    1,
    12,
    1,
    1695810600000,
    1695812400000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    12,
    '26307130-c88d-4a3d-8131-bdc3e1ff9de2',
    1,
    1,
    12,
    1,
    1696415400000,
    1696417200000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    13,
    '313a8054-26c0-4f58-9a6d-1a59a6043564',
    1,
    1,
    12,
    1,
    1697020200000,
    1697022000000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    14,
    'c876f76b-f7e8-48af-ae25-de4a3c0822eb',
    1,
    1,
    12,
    1,
    1697625000000,
    1697626800000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    15,
    '0319a2d3-8a62-4985-b6f6-cdb4789375c0',
    1,
    1,
    12,
    1,
    1698229800000,
    1698231600000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    16,
    '72637f14-1397-4659-ad4e-b1816952d750',
    1,
    1,
    12,
    1,
    1698834600000,
    1698836400000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    17,
    '1a06353a-6f49-494b-9c19-242844d6b73d',
    1,
    1,
    12,
    1,
    1699439400000,
    1699441200000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    18,
    'c588c006-4f01-4796-863f-a13784365ded',
    1,
    1,
    12,
    1,
    1700044200000,
    1700046000000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    19,
    'e01cf853-ac34-475c-abb0-70818cc18b38',
    1,
    1,
    12,
    1,
    1700649000000,
    1700650800000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    20,
    'e7692e18-4c6d-4c9c-96c2-3ce257260333',
    1,
    1,
    12,
    1,
    1701253800000,
    1701255600000,
    1,
    NULL,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  bookings
VALUES
  (
    21,
    'fa18e0f2-5507-4630-8eba-30713ceba4aa',
    1,
    1,
    5,
    1,
    1695812400000,
    1695814200000,
    4,
    NULL,
    1,
    1695797911765,
    1695799393935
  );

INSERT INTO
  bookings
VALUES
  (
    22,
    '74998393-35a6-45fb-967b-3c0798a4e809',
    1,
    1,
    5,
    1,
    1696417200000,
    1696419000000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    23,
    '4ce1a714-d5cd-40d2-87f4-3b2ea8141c7f',
    1,
    1,
    5,
    1,
    1697022000000,
    1697023800000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    24,
    'a7f8159e-7a94-4a23-943b-0ac358f8ddec',
    1,
    1,
    5,
    1,
    1697626800000,
    1697628600000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    25,
    '7575344e-b6bf-4cd3-bbec-7df1d3b32dc9',
    1,
    1,
    5,
    1,
    1698231600000,
    1698233400000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    26,
    '7f619f90-8ecd-4897-bed3-09e55b338d65',
    1,
    1,
    5,
    1,
    1698836400000,
    1698838200000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    27,
    '43ac7183-4153-417f-9058-47d520f58576',
    1,
    1,
    5,
    1,
    1699441200000,
    1699443000000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    28,
    '264656ca-59fa-4a2e-9353-9bef3690810e',
    1,
    1,
    5,
    1,
    1700046000000,
    1700047800000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    29,
    'b075c107-8c82-4116-b27e-235107c5e231',
    1,
    1,
    5,
    1,
    1700650800000,
    1700652600000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    30,
    '8456e7da-adb2-4403-9a1c-b5a1dd643c35',
    1,
    1,
    5,
    1,
    1701255600000,
    1701257400000,
    1,
    NULL,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  bookings
VALUES
  (
    31,
    '77b67335-0d8d-4f5e-870a-056e663dd6f7',
    1,
    1,
    4,
    1,
    1695814200000,
    1695816000000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    32,
    '6244340f-8834-411c-b35b-037b8d3c5dac',
    1,
    1,
    4,
    1,
    1696419000000,
    1696420800000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    33,
    'affe92f4-4453-4746-8ae2-862b13948577',
    1,
    1,
    4,
    1,
    1697023800000,
    1697025600000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    34,
    'f6c3a836-114c-4e3b-b225-34ce226a97f0',
    1,
    1,
    4,
    1,
    1697628600000,
    1697630400000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    35,
    '408c395b-16e7-43db-a7f0-f559ca491e5a',
    1,
    1,
    4,
    1,
    1698233400000,
    1698235200000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    36,
    '2109a048-8ce3-46e1-b950-6f8366c57171',
    1,
    1,
    4,
    1,
    1698838200000,
    1698840000000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    37,
    'a44fdea0-b55e-4cfd-a87f-ef43f307e16c',
    1,
    1,
    4,
    1,
    1699443000000,
    1699444800000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    38,
    'b2352369-9d0e-4978-a504-acf2c037cbb9',
    1,
    1,
    4,
    1,
    1700047800000,
    1700049600000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    39,
    '0c2594fc-7290-4c30-8f5d-854cd4a7a32b',
    1,
    1,
    4,
    1,
    1700652600000,
    1700654400000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    40,
    'f795c2c2-4864-4f9a-b584-00617391111f',
    1,
    1,
    4,
    1,
    1701257400000,
    1701259200000,
    1,
    NULL,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  bookings
VALUES
  (
    41,
    'e91959e4-532a-4047-b314-9786d635bc8e',
    1,
    1,
    11,
    1,
    1695816000000,
    1695817800000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    42,
    '6cb337b6-c68e-4983-bb4e-74168cb42794',
    1,
    1,
    11,
    1,
    1696420800000,
    1696422600000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    43,
    '8fa81e9a-b7a5-4df9-998f-13b19ba1b9b4',
    1,
    1,
    11,
    1,
    1697025600000,
    1697027400000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    44,
    '1b9cd0dc-8b70-48b3-888d-f6c6832158fe',
    1,
    1,
    11,
    1,
    1697630400000,
    1697632200000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    45,
    'aade31ca-dbb3-4093-a289-72776f1ac769',
    1,
    1,
    11,
    1,
    1698235200000,
    1698237000000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    46,
    '48d1787f-5747-44d8-bd95-06cdc163ab92',
    1,
    1,
    11,
    1,
    1698840000000,
    1698841800000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    47,
    'fa2b069d-db5d-41e3-9a6c-434c8c86dd0b',
    1,
    1,
    11,
    1,
    1699444800000,
    1699446600000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    48,
    'bfb0037c-96d6-4019-83c0-ff830fe0bc02',
    1,
    1,
    11,
    1,
    1700049600000,
    1700051400000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    49,
    'b1b39f5a-af7b-4b49-b37a-6dfac5f46ac9',
    1,
    1,
    11,
    1,
    1700654400000,
    1700656200000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    50,
    'e77dffcc-d1f3-49b6-8d4e-e704100b0a5b',
    1,
    1,
    11,
    1,
    1701259200000,
    1701261000000,
    1,
    NULL,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  bookings
VALUES
  (
    51,
    'ead02351-71a8-4d56-bfd8-2fd7448c5940',
    1,
    1,
    6,
    1,
    1695898800000,
    1695900600000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    52,
    '2432265c-41dd-413e-b56b-458e0832f2a8',
    1,
    1,
    6,
    1,
    1696503600000,
    1696505400000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    53,
    'e7d95c98-4944-44ff-937c-94bbfc4ccfb1',
    1,
    1,
    6,
    1,
    1697108400000,
    1697110200000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    54,
    'ac86824e-7167-4919-a699-7a170866a7f5',
    1,
    1,
    6,
    1,
    1697713200000,
    1697715000000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    55,
    '6e1f66a5-0035-4e3b-bb27-6bd1ac0e080a',
    1,
    1,
    6,
    1,
    1698318000000,
    1698319800000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    56,
    '23d3cd4c-b712-4ed2-a3b2-8a0439b94756',
    1,
    1,
    6,
    1,
    1698922800000,
    1698924600000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    57,
    '99f962a0-9f47-49d3-b625-5763cd92240e',
    1,
    1,
    6,
    1,
    1699527600000,
    1699529400000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    58,
    '38dbffe7-7dec-4c7e-a7e3-b8e9c6bcf452',
    1,
    1,
    6,
    1,
    1700132400000,
    1700134200000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    59,
    '2e392943-7b75-473f-a25d-0e5e38080479',
    1,
    1,
    6,
    1,
    1700737200000,
    1700739000000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    60,
    'f2fda89e-67ac-407a-9348-1a06d64a0895',
    1,
    1,
    6,
    1,
    1701342000000,
    1701343800000,
    1,
    NULL,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  bookings
VALUES
  (
    61,
    'd9fcdef1-6b72-4d00-b199-01d48694a55e',
    1,
    1,
    7,
    1,
    1695988800000,
    1695990600000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    62,
    '053c6ea5-3038-42e0-b5d8-8ce3510ce9c7',
    1,
    1,
    7,
    1,
    1696593600000,
    1696595400000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    63,
    '2b7535b9-81e7-49f4-bd21-0be393335043',
    1,
    1,
    7,
    1,
    1697198400000,
    1697200200000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    64,
    '082f0878-ffdb-4f27-9f95-0a0a342fa1c4',
    1,
    1,
    7,
    1,
    1697803200000,
    1697805000000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    65,
    '270d23e0-685f-4197-afae-a65b9bba4529',
    1,
    1,
    7,
    1,
    1698408000000,
    1698409800000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    66,
    'f594b442-cda9-4419-b337-0ef58ee7bf18',
    1,
    1,
    7,
    1,
    1699012800000,
    1699014600000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    67,
    'd5014589-65d0-41df-85b4-da0551cd2249',
    1,
    1,
    7,
    1,
    1699617600000,
    1699619400000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    68,
    'd5df4ef3-89db-4317-8383-e4fad296da98',
    1,
    1,
    7,
    1,
    1700222400000,
    1700224200000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    69,
    '96d1c5ab-b4e0-47b5-8212-3cb0e46c22c8',
    1,
    1,
    7,
    1,
    1700827200000,
    1700829000000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    70,
    '058e783f-4e2b-41e1-adf5-03f9521ffbb4',
    1,
    1,
    7,
    1,
    1701432000000,
    1701433800000,
    4,
    NULL,
    1,
    1695798033363,
    1695798278019
  );

INSERT INTO
  bookings
VALUES
  (
    71,
    '7afca441-2a92-4a95-a6bd-1caa2654ab0e',
    1,
    1,
    9,
    1,
    1695990600000,
    1695992400000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    72,
    '9ead8516-e30f-4d19-b706-10508ace40d2',
    1,
    1,
    9,
    1,
    1696595400000,
    1696597200000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    73,
    '650892ef-fed6-4117-a696-8a667f5ca9a5',
    1,
    1,
    9,
    1,
    1697200200000,
    1697202000000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    74,
    'ee0da638-6852-4a96-98fc-5ef329b17170',
    1,
    1,
    9,
    1,
    1697805000000,
    1697806800000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    75,
    '16c07584-1714-4bf4-9757-e4d1fe0259e1',
    1,
    1,
    9,
    1,
    1698409800000,
    1698411600000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    76,
    'ef97eb04-f985-427e-b35f-b82678a476f6',
    1,
    1,
    9,
    1,
    1699014600000,
    1699016400000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    77,
    'dec57a4f-bced-46d4-86cc-d6559cf930d9',
    1,
    1,
    9,
    1,
    1699619400000,
    1699621200000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    78,
    'ac92572e-d5e6-43e7-864e-50335cabfdf3',
    1,
    1,
    9,
    1,
    1700224200000,
    1700226000000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    79,
    '596c3452-c67d-4854-aa56-ba4aee7298fb',
    1,
    1,
    9,
    1,
    1700829000000,
    1700830800000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    80,
    'e68d6a0e-8ed1-4c1d-b872-c149898138d5',
    1,
    1,
    9,
    1,
    1701433800000,
    1701435600000,
    4,
    NULL,
    1,
    1695798045281,
    1695798331174
  );

INSERT INTO
  bookings
VALUES
  (
    81,
    '07256471-9e05-493b-9b1a-072378ab8a73',
    1,
    1,
    2,
    1,
    1696069800000,
    1696071600000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    82,
    '518ffd00-c0b4-4615-bbd4-76a1bb4a15ca',
    1,
    1,
    2,
    1,
    1696674600000,
    1696676400000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    83,
    '91696e01-08f8-48cc-9c06-e5736159b6f5',
    1,
    1,
    2,
    1,
    1697279400000,
    1697281200000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    84,
    'f6cfc2dd-6673-4dad-b120-2fd429fd8a93',
    1,
    1,
    2,
    1,
    1697884200000,
    1697886000000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    85,
    '67eb8298-f2ff-4993-bbeb-a9cee88263d6',
    1,
    1,
    2,
    1,
    1698489000000,
    1698490800000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    86,
    '25799ff4-cdd8-462a-9e1e-12086f10344e',
    1,
    1,
    2,
    1,
    1699093800000,
    1699095600000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    87,
    '7a5dad99-6a84-4e3e-96aa-5fba1c810920',
    1,
    1,
    2,
    1,
    1699698600000,
    1699700400000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    88,
    '017242c9-a63e-4aad-9b18-347b01fd9283',
    1,
    1,
    2,
    1,
    1700303400000,
    1700305200000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    89,
    '941e0f33-06e4-497d-ae43-fe73eefc6d79',
    1,
    1,
    2,
    1,
    1700908200000,
    1700910000000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    90,
    'fba0116e-3eb0-4ae3-800c-eee230299f3b',
    1,
    1,
    2,
    1,
    1701513000000,
    1701514800000,
    1,
    NULL,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  bookings
VALUES
  (
    91,
    'b3361490-4ea8-41ee-901c-296e8370b210',
    1,
    1,
    8,
    1,
    1696071600000,
    1696073400000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    92,
    '2ce3fed6-3e79-4c84-bbdb-8e1ddcb800df',
    1,
    1,
    8,
    1,
    1696676400000,
    1696678200000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    93,
    'de53535a-d7a8-4444-a193-a3cc72d21952',
    1,
    1,
    8,
    1,
    1697281200000,
    1697283000000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    94,
    '65f3d8dd-614d-4e81-a9cf-b7c757f48f7a',
    1,
    1,
    8,
    1,
    1697886000000,
    1697887800000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    95,
    '7f9e4d89-1c7e-425f-908a-26582834d0f9',
    1,
    1,
    8,
    1,
    1698490800000,
    1698492600000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    96,
    'abc8a039-d45c-4ef7-a383-25bbf548bd27',
    1,
    1,
    8,
    1,
    1699095600000,
    1699097400000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    97,
    'd7df1f07-b88f-4aa8-943c-c4c52aa432d1',
    1,
    1,
    8,
    1,
    1699700400000,
    1699702200000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    98,
    'fb33f086-6a06-4255-8a9d-f1173e0f1c3b',
    1,
    1,
    8,
    1,
    1700305200000,
    1700307000000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    99,
    'f6f7b34e-93a2-484a-b7a6-09881d085480',
    1,
    1,
    8,
    1,
    1700910000000,
    1700911800000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    100,
    '9c5678fd-897e-45ef-9b79-17dc2c413d13',
    1,
    1,
    8,
    1,
    1701514800000,
    1701516600000,
    1,
    NULL,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  bookings
VALUES
  (
    101,
    '6e3b3e29-0e58-4b46-b695-20ca7dd4e22c',
    1,
    1,
    13,
    1,
    1696073400000,
    1696075200000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    102,
    '391a01b8-8db3-4d9e-b125-e0427e357633',
    1,
    1,
    13,
    1,
    1696678200000,
    1696680000000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    103,
    'b71abd16-76d7-4d58-8e09-f22b00d08afa',
    1,
    1,
    13,
    1,
    1697283000000,
    1697284800000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    104,
    '16ec7f67-0e9d-4dc1-9ac9-551575e2ed7a',
    1,
    1,
    13,
    1,
    1697887800000,
    1697889600000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    105,
    '692c2b55-b6f8-411b-89e5-bdcd19707d0a',
    1,
    1,
    13,
    1,
    1698492600000,
    1698494400000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    106,
    '7152598d-2cfb-4526-9490-655171e3730c',
    1,
    1,
    13,
    1,
    1699097400000,
    1699099200000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    107,
    'a116792e-cffc-46f2-bc98-5bb19e25ca64',
    1,
    1,
    13,
    1,
    1699702200000,
    1699704000000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    108,
    'c8d06922-5953-4a17-9f17-81328218717b',
    1,
    1,
    13,
    1,
    1700307000000,
    1700308800000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    109,
    'c60b638f-f1ab-46d5-9223-27c45b20ef23',
    1,
    1,
    13,
    1,
    1700911800000,
    1700913600000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    110,
    'c8207269-bc7d-4aec-9c69-896e01358e40',
    1,
    1,
    13,
    1,
    1701516600000,
    1701518400000,
    1,
    NULL,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  bookings
VALUES
  (
    111,
    '17631e33-a36c-4721-a1d1-4effecc881c1',
    1,
    1,
    4,
    1,
    1696075200000,
    1696077000000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    112,
    '225cf3c1-51b4-4fd9-b75f-3a6167d271ec',
    1,
    1,
    4,
    1,
    1696680000000,
    1696681800000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    113,
    '4ff80ba3-34be-4d91-b220-0e3dc08d107d',
    1,
    1,
    4,
    1,
    1697284800000,
    1697286600000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    114,
    '012ff8c1-8349-4f3e-8a75-80b8d0108141',
    1,
    1,
    4,
    1,
    1697889600000,
    1697891400000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    115,
    '6b80ff2c-0e1d-4092-a99c-6609987b959c',
    1,
    1,
    4,
    1,
    1698494400000,
    1698496200000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    116,
    '3e5de580-bd07-40a2-9d7c-af82b3f1b272',
    1,
    1,
    4,
    1,
    1699099200000,
    1699101000000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    117,
    '74fb4866-ecee-4951-acc9-ca79fd2dfea4',
    1,
    1,
    4,
    1,
    1699704000000,
    1699705800000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    118,
    '0780efe8-a45c-424c-9a29-c266aeddabce',
    1,
    1,
    4,
    1,
    1700308800000,
    1700310600000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    119,
    '8c597912-1261-429a-ab32-c8de90ec75c5',
    1,
    1,
    4,
    1,
    1700913600000,
    1700915400000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    120,
    '072abca0-d2fc-4203-b2cf-001293eae849',
    1,
    1,
    4,
    1,
    1701518400000,
    1701520200000,
    1,
    NULL,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  bookings
VALUES
  (
    121,
    '2cac240a-166d-4b31-a5ae-47f98765bea0',
    1,
    1,
    10,
    1,
    1696077000000,
    1696078800000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    122,
    'cf363e81-6d37-405d-810b-374627b1331c',
    1,
    1,
    10,
    1,
    1696681800000,
    1696683600000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    123,
    'c8933b19-8efc-40e5-afeb-3788412ff449',
    1,
    1,
    10,
    1,
    1697286600000,
    1697288400000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    124,
    '9ad48c13-b470-4d94-bba4-3bad84904985',
    1,
    1,
    10,
    1,
    1697891400000,
    1697893200000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    125,
    'd93614f5-446d-4724-8ce6-b8db8b362636',
    1,
    1,
    10,
    1,
    1698496200000,
    1698498000000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    126,
    'f1335ec2-71d9-4e1d-8755-ea0fecd7ae93',
    1,
    1,
    10,
    1,
    1699101000000,
    1699102800000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    127,
    '9e1acbf2-7022-47ef-bcf4-08b55680ee15',
    1,
    1,
    10,
    1,
    1699705800000,
    1699707600000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    128,
    'bbedda37-a1e8-4925-b515-fae270019436',
    1,
    1,
    10,
    1,
    1700310600000,
    1700312400000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    129,
    '9ed8f89b-980a-4072-997f-18ca2365351d',
    1,
    1,
    10,
    1,
    1700915400000,
    1700917200000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    130,
    'a3cda325-02b0-40ff-91c8-448cb2d004f4',
    1,
    1,
    10,
    1,
    1701520200000,
    1701522000000,
    1,
    NULL,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  bookings
VALUES
  (
    131,
    '7dd2f7b5-bb87-4e81-abb4-2910c52335eb',
    1,
    1,
    7,
    1,
    1696078800000,
    1696080600000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    132,
    '60a44fec-2ce4-4ad2-bf05-0108b766dd8a',
    1,
    1,
    7,
    1,
    1696683600000,
    1696685400000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    133,
    '8fbc2d7a-bb55-4c9a-9e98-6069e3c5b08a',
    1,
    1,
    7,
    1,
    1697288400000,
    1697290200000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    134,
    '4180a2b6-1911-4914-9039-0ee0d4788b4a',
    1,
    1,
    7,
    1,
    1697893200000,
    1697895000000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    135,
    'b847dc5d-4b75-4e55-86ec-c34e484bde45',
    1,
    1,
    7,
    1,
    1698498000000,
    1698499800000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    136,
    'bdb20f0e-f939-4bfb-ae32-26ac0d66b931',
    1,
    1,
    7,
    1,
    1699102800000,
    1699104600000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    137,
    'b250fb57-a66f-4a13-aaaf-4227584b3d53',
    1,
    1,
    7,
    1,
    1699707600000,
    1699709400000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    138,
    '0974dec4-57b3-41d6-8722-cf40b47eac25',
    1,
    1,
    7,
    1,
    1700312400000,
    1700314200000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    139,
    'cff4a774-09a4-438c-b54a-59dccb7eca04',
    1,
    1,
    7,
    1,
    1700917200000,
    1700919000000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    140,
    '9db7213d-00c3-4d69-b844-d3eeb28b3c1d',
    1,
    1,
    7,
    1,
    1701522000000,
    1701523800000,
    1,
    NULL,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  bookings
VALUES
  (
    141,
    '7fcf161a-5d28-420d-94e0-a3442afe3a75',
    1,
    1,
    12,
    1,
    1702126800000,
    1702128600000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    142,
    'de177232-2209-41dd-9652-9b737982e511',
    1,
    1,
    12,
    1,
    1702731600000,
    1702733400000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    143,
    '34f5bed3-d86d-4b90-8d54-1a417e022717',
    1,
    1,
    12,
    1,
    1703336400000,
    1703338200000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    144,
    'e035499a-a875-4777-89d7-f759a19e9481',
    1,
    1,
    12,
    1,
    1703941200000,
    1703943000000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    145,
    'bf142370-8b31-47b0-91bf-6d44e387efa9',
    1,
    1,
    12,
    1,
    1704546000000,
    1704547800000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    146,
    'f4098787-a03f-41a3-9ee9-7eeb9c29d926',
    1,
    1,
    12,
    1,
    1705150800000,
    1705152600000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    147,
    '412a7518-0b39-4310-85b5-473cc4282394',
    1,
    1,
    12,
    1,
    1705755600000,
    1705757400000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    148,
    '81a622bc-4dde-4064-abcf-34ef9bf2b2e4',
    1,
    1,
    12,
    1,
    1706360400000,
    1706362200000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    149,
    '19a61b9c-3e00-4655-b758-71a829a9215e',
    1,
    1,
    12,
    1,
    1706965200000,
    1706967000000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    150,
    '8cd1d0f2-caad-4550-85ab-607c75cce782',
    1,
    1,
    12,
    1,
    1707570000000,
    1707571800000,
    1,
    NULL,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  bookings
VALUES
  (
    151,
    'f8d2a30d-2119-44bd-a080-f385a35e6e30',
    1,
    1,
    7,
    1,
    1695990600000,
    1695992400000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    152,
    'f6703301-6007-4002-93ae-c11095295c5a',
    1,
    1,
    7,
    1,
    1696595400000,
    1696597200000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    153,
    'cbe09591-df0e-4d21-a120-63789ede8fe2',
    1,
    1,
    7,
    1,
    1697200200000,
    1697202000000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    154,
    '3f5e89bd-785c-4ed2-997c-38c0de08a74d',
    1,
    1,
    7,
    1,
    1697805000000,
    1697806800000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    155,
    '6100ce56-9bb1-4137-aa52-dca0b207712c',
    1,
    1,
    7,
    1,
    1698409800000,
    1698411600000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    156,
    '8f95aab1-9621-43ef-ae30-890a84c2492e',
    1,
    1,
    7,
    1,
    1699014600000,
    1699016400000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    157,
    '2c64f645-67a0-41da-b40f-5255a219b58b',
    1,
    1,
    7,
    1,
    1699619400000,
    1699621200000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    158,
    '55284788-f7e9-4124-87e4-59eab780c867',
    1,
    1,
    7,
    1,
    1700224200000,
    1700226000000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    159,
    'fef23dfe-bae0-4050-839c-ccfe7e6e46ab',
    1,
    1,
    7,
    1,
    1700829000000,
    1700830800000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    160,
    '52837be6-f272-461a-a4db-a382aff8da8b',
    1,
    1,
    7,
    1,
    1701433800000,
    1701435600000,
    1,
    NULL,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  bookings
VALUES
  (
    161,
    '6e11e37f-7322-46d1-86a8-45a060f034ac',
    1,
    1,
    9,
    1,
    1695992400000,
    1695994200000,
    1,
    NULL,
    1,
    1695798368108,
    1695798368108
  );

INSERT INTO
  bookings
VALUES
  (
    162,
    'd26061ea-0487-4908-90d7-6d9505992f0d',
    1,
    1,
    12,
    1,
    1696080600000,
    1696082400000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    163,
    '1de63d80-fea4-496c-8e2e-5eec1d394222',
    1,
    1,
    12,
    1,
    1696685400000,
    1696687200000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    164,
    'b6e6e4dd-4fae-4785-806e-f3a98c36ebfd',
    1,
    1,
    12,
    1,
    1697290200000,
    1697292000000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    165,
    '3da1eaa4-59fd-4575-8d53-b5d33ec4512a',
    1,
    1,
    12,
    1,
    1697895000000,
    1697896800000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    166,
    '2651cdc7-8309-4b05-97b0-a38fe39527f3',
    1,
    1,
    12,
    1,
    1698499800000,
    1698501600000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    167,
    'e97aeb3b-d73f-4ac3-afb6-a0b1c98c41eb',
    1,
    1,
    12,
    1,
    1699104600000,
    1699106400000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    168,
    'e3a3042b-8930-4ca8-bcab-318f3f591e69',
    1,
    1,
    12,
    1,
    1699709400000,
    1699711200000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    169,
    '0d0af949-16d8-4fc7-9c13-ba8078ee692c',
    1,
    1,
    12,
    1,
    1700314200000,
    1700316000000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    170,
    'b70ee9bc-bcfb-4e8f-b6cb-32c41fc625e6',
    1,
    1,
    12,
    1,
    1700919000000,
    1700920800000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    171,
    'b61e7380-fa52-4cd9-8a3b-2ea996441ba7',
    1,
    1,
    12,
    1,
    1701523800000,
    1701525600000,
    1,
    NULL,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  bookings
VALUES
  (
    172,
    'be33fe90-74ef-4406-8504-bb55d8b24f48',
    1,
    1,
    5,
    1,
    1696244400000,
    1696246200000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    173,
    'f7be5a6e-262c-46d9-86aa-91074c3bbe2d',
    1,
    1,
    5,
    1,
    1696849200000,
    1696851000000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    174,
    '7ba4b13e-64b7-4e54-93fa-de58de8eed52',
    1,
    1,
    5,
    1,
    1697454000000,
    1697455800000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    175,
    '9566833b-b67f-4cfc-a719-1a8f5c23339e',
    1,
    1,
    5,
    1,
    1698058800000,
    1698060600000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    176,
    'bff6f60c-fd86-45f1-b632-959b427e2543',
    1,
    1,
    5,
    1,
    1698663600000,
    1698665400000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    177,
    '93f54c15-8e2f-4492-b770-af9fd0c55c40',
    1,
    1,
    5,
    1,
    1699268400000,
    1699270200000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    178,
    '33683186-8b87-40dc-9c2a-c60ced01a3e8',
    1,
    1,
    5,
    1,
    1699873200000,
    1699875000000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    179,
    '859c76ca-ae97-4099-8921-9e0b95de0737',
    1,
    1,
    5,
    1,
    1700478000000,
    1700479800000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    180,
    '9a1ef36e-5653-4f49-a38d-0359b2b4d240',
    1,
    1,
    5,
    1,
    1701082800000,
    1701084600000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    181,
    '04431af8-b1fc-4c50-995d-aecd30222bdf',
    1,
    1,
    5,
    1,
    1701687600000,
    1701689400000,
    1,
    NULL,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  bookings
VALUES
  (
    182,
    'c0f3d23d-b1b4-42c5-82cf-1dae7b01c106',
    1,
    1,
    12,
    1,
    1696248000000,
    1696249800000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    183,
    'fcb69b91-2c1a-4c25-951f-8b86c8e63dca',
    1,
    1,
    12,
    1,
    1696852800000,
    1696854600000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    184,
    'beb61b66-fce1-42b4-b6a5-903afe5c6800',
    1,
    1,
    12,
    1,
    1697457600000,
    1697459400000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    185,
    'dabfe7de-dd38-479d-9b65-35000335bd6f',
    1,
    1,
    12,
    1,
    1698062400000,
    1698064200000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    186,
    '97db5815-4780-41e2-bd9f-79e6469635c7',
    1,
    1,
    12,
    1,
    1698667200000,
    1698669000000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    187,
    '89caa5de-3fe4-4ddc-bcc1-e56fece011ba',
    1,
    1,
    12,
    1,
    1699272000000,
    1699273800000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    188,
    '0ce7f286-443d-4b54-8194-ac72aaa81757',
    1,
    1,
    12,
    1,
    1699876800000,
    1699878600000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    189,
    'd22139dd-d661-4cae-a94e-18ca56366707',
    1,
    1,
    12,
    1,
    1700481600000,
    1700483400000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    190,
    'e23bc02b-36ad-450a-8ba8-f30de24ee48b',
    1,
    1,
    12,
    1,
    1701086400000,
    1701088200000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    191,
    '9687d40a-b7a6-4e11-b0ef-1c782ec62b23',
    1,
    1,
    12,
    1,
    1701691200000,
    1701693000000,
    1,
    NULL,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  bookings
VALUES
  (
    192,
    '37c89658-1212-4ced-8661-d4d48d23f43f',
    1,
    1,
    9,
    1,
    1696597200000,
    1696599000000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    193,
    'd3a73fa6-08c1-4105-9b20-dfe8db8d42bc',
    1,
    1,
    9,
    1,
    1697202000000,
    1697203800000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    194,
    '2637cfae-dd46-4b9a-b3f8-5b6b4f1896c6',
    1,
    1,
    9,
    1,
    1697806800000,
    1697808600000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    195,
    'c196e978-023f-47a8-8d3b-047f5df50193',
    1,
    1,
    9,
    1,
    1698411600000,
    1698413400000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    196,
    '0f23bf15-5d2c-4ff5-ad78-83bd2899beef',
    1,
    1,
    9,
    1,
    1699016400000,
    1699018200000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    197,
    'd6fc925b-ea04-4456-b640-448041a5a8dc',
    1,
    1,
    9,
    1,
    1699621200000,
    1699623000000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    198,
    '66938cc0-09c9-4f63-94d3-ad075577be6d',
    1,
    1,
    9,
    1,
    1700226000000,
    1700227800000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    199,
    'bc015f92-e03d-442c-8d22-558042a5cd8c',
    1,
    1,
    9,
    1,
    1700830800000,
    1700832600000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  bookings
VALUES
  (
    200,
    'da4ad866-c71b-4710-98c2-1e349f73c808',
    1,
    1,
    9,
    1,
    1701435600000,
    1701437400000,
    1,
    NULL,
    1,
    1695800902796,
    1695800902796
  );

CREATE TABLE
  logsCredit (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    amount INTEGER NOT NULL,
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  logsCredit
VALUES
  (
    1,
    4,
    'Credit Add',
    'Credit Add 100',
    100,
    1,
    1695796082809,
    1695796082809
  );

INSERT INTO
  logsCredit
VALUES
  (
    2,
    5,
    'Credit Add',
    'Credit Add 100',
    100,
    1,
    1695796090091,
    1695796090091
  );

INSERT INTO
  logsCredit
VALUES
  (
    3,
    6,
    'Credit Add',
    'Credit Add 100',
    100,
    1,
    1695796094139,
    1695796094139
  );

INSERT INTO
  logsCredit
VALUES
  (
    4,
    11,
    'Credit Add',
    'Credit Add 100',
    100,
    1,
    1695796099554,
    1695796099554
  );

INSERT INTO
  logsCredit
VALUES
  (
    5,
    13,
    'Credit Add',
    'Credit Add 100',
    100,
    1,
    1695796107682,
    1695796107682
  );

INSERT INTO
  logsCredit
VALUES
  (
    6,
    5,
    'Class 2023年9月27日 18:00',
    'Class 2023年9月27日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    7,
    5,
    'Class 2023年10月4日 18:00',
    'Class 2023年10月4日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    8,
    5,
    'Class 2023年10月11日 18:00',
    'Class 2023年10月11日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    9,
    5,
    'Class 2023年10月18日 18:00',
    'Class 2023年10月18日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    10,
    5,
    'Class 2023年10月25日 18:00',
    'Class 2023年10月25日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    11,
    5,
    'Class 2023年11月1日 18:00',
    'Class 2023年11月1日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    12,
    5,
    'Class 2023年11月8日 18:00',
    'Class 2023年11月8日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    13,
    5,
    'Class 2023年11月15日 18:00',
    'Class 2023年11月15日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    14,
    5,
    'Class 2023年11月22日 18:00',
    'Class 2023年11月22日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    15,
    5,
    'Class 2023年11月29日 18:00',
    'Class 2023年11月29日 18:00',
    -1,
    1,
    1695797870551,
    1695797870551
  );

INSERT INTO
  logsCredit
VALUES
  (
    16,
    14,
    'Class 2023年9月27日 18:30',
    'Class 2023年9月27日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    17,
    14,
    'Class 2023年10月4日 18:30',
    'Class 2023年10月4日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    18,
    14,
    'Class 2023年10月11日 18:30',
    'Class 2023年10月11日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    19,
    14,
    'Class 2023年10月18日 18:30',
    'Class 2023年10月18日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    20,
    14,
    'Class 2023年10月25日 18:30',
    'Class 2023年10月25日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    21,
    14,
    'Class 2023年11月1日 18:30',
    'Class 2023年11月1日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    22,
    14,
    'Class 2023年11月8日 18:30',
    'Class 2023年11月8日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    23,
    14,
    'Class 2023年11月15日 18:30',
    'Class 2023年11月15日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    24,
    14,
    'Class 2023年11月22日 18:30',
    'Class 2023年11月22日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    25,
    14,
    'Class 2023年11月29日 18:30',
    'Class 2023年11月29日 18:30',
    -1,
    1,
    1695797896894,
    1695797896894
  );

INSERT INTO
  logsCredit
VALUES
  (
    26,
    7,
    'Class 2023年9月27日 19:00',
    'Class 2023年9月27日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    27,
    7,
    'Class 2023年10月4日 19:00',
    'Class 2023年10月4日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    28,
    7,
    'Class 2023年10月11日 19:00',
    'Class 2023年10月11日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    29,
    7,
    'Class 2023年10月18日 19:00',
    'Class 2023年10月18日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    30,
    7,
    'Class 2023年10月25日 19:00',
    'Class 2023年10月25日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    31,
    7,
    'Class 2023年11月1日 19:00',
    'Class 2023年11月1日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    32,
    7,
    'Class 2023年11月8日 19:00',
    'Class 2023年11月8日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    33,
    7,
    'Class 2023年11月15日 19:00',
    'Class 2023年11月15日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    34,
    7,
    'Class 2023年11月22日 19:00',
    'Class 2023年11月22日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    35,
    7,
    'Class 2023年11月29日 19:00',
    'Class 2023年11月29日 19:00',
    -1,
    1,
    1695797911765,
    1695797911765
  );

INSERT INTO
  logsCredit
VALUES
  (
    36,
    6,
    'Class 2023年9月27日 19:30',
    'Class 2023年9月27日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    37,
    6,
    'Class 2023年10月4日 19:30',
    'Class 2023年10月4日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    38,
    6,
    'Class 2023年10月11日 19:30',
    'Class 2023年10月11日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    39,
    6,
    'Class 2023年10月18日 19:30',
    'Class 2023年10月18日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    40,
    6,
    'Class 2023年10月25日 19:30',
    'Class 2023年10月25日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    41,
    6,
    'Class 2023年11月1日 19:30',
    'Class 2023年11月1日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    42,
    6,
    'Class 2023年11月8日 19:30',
    'Class 2023年11月8日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    43,
    6,
    'Class 2023年11月15日 19:30',
    'Class 2023年11月15日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    44,
    6,
    'Class 2023年11月22日 19:30',
    'Class 2023年11月22日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    45,
    6,
    'Class 2023年11月29日 19:30',
    'Class 2023年11月29日 19:30',
    -1,
    1,
    1695797926873,
    1695797926873
  );

INSERT INTO
  logsCredit
VALUES
  (
    46,
    13,
    'Class 2023年9月27日 20:00',
    'Class 2023年9月27日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    47,
    13,
    'Class 2023年10月4日 20:00',
    'Class 2023年10月4日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    48,
    13,
    'Class 2023年10月11日 20:00',
    'Class 2023年10月11日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    49,
    13,
    'Class 2023年10月18日 20:00',
    'Class 2023年10月18日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    50,
    13,
    'Class 2023年10月25日 20:00',
    'Class 2023年10月25日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    51,
    13,
    'Class 2023年11月1日 20:00',
    'Class 2023年11月1日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    52,
    13,
    'Class 2023年11月8日 20:00',
    'Class 2023年11月8日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    53,
    13,
    'Class 2023年11月15日 20:00',
    'Class 2023年11月15日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    54,
    13,
    'Class 2023年11月22日 20:00',
    'Class 2023年11月22日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    55,
    13,
    'Class 2023年11月29日 20:00',
    'Class 2023年11月29日 20:00',
    -1,
    1,
    1695797939865,
    1695797939865
  );

INSERT INTO
  logsCredit
VALUES
  (
    56,
    8,
    'Class 2023年9月28日 19:00',
    'Class 2023年9月28日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    57,
    8,
    'Class 2023年10月5日 19:00',
    'Class 2023年10月5日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    58,
    8,
    'Class 2023年10月12日 19:00',
    'Class 2023年10月12日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    59,
    8,
    'Class 2023年10月19日 19:00',
    'Class 2023年10月19日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    60,
    8,
    'Class 2023年10月26日 19:00',
    'Class 2023年10月26日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    61,
    8,
    'Class 2023年11月2日 19:00',
    'Class 2023年11月2日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    62,
    8,
    'Class 2023年11月9日 19:00',
    'Class 2023年11月9日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    63,
    8,
    'Class 2023年11月16日 19:00',
    'Class 2023年11月16日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    64,
    8,
    'Class 2023年11月23日 19:00',
    'Class 2023年11月23日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    65,
    8,
    'Class 2023年11月30日 19:00',
    'Class 2023年11月30日 19:00',
    -1,
    1,
    1695798007919,
    1695798007919
  );

INSERT INTO
  logsCredit
VALUES
  (
    66,
    9,
    'Class 2023年9月29日 20:00',
    'Class 2023年9月29日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    67,
    9,
    'Class 2023年10月6日 20:00',
    'Class 2023年10月6日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    68,
    9,
    'Class 2023年10月13日 20:00',
    'Class 2023年10月13日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    69,
    9,
    'Class 2023年10月20日 20:00',
    'Class 2023年10月20日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    70,
    9,
    'Class 2023年10月27日 20:00',
    'Class 2023年10月27日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    71,
    9,
    'Class 2023年11月3日 20:00',
    'Class 2023年11月3日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    72,
    9,
    'Class 2023年11月10日 20:00',
    'Class 2023年11月10日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    73,
    9,
    'Class 2023年11月17日 20:00',
    'Class 2023年11月17日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    74,
    9,
    'Class 2023年11月24日 20:00',
    'Class 2023年11月24日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    75,
    9,
    'Class 2023年12月1日 20:00',
    'Class 2023年12月1日 20:00',
    -1,
    1,
    1695798033363,
    1695798033363
  );

INSERT INTO
  logsCredit
VALUES
  (
    76,
    11,
    'Class 2023年9月29日 20:30',
    'Class 2023年9月29日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    77,
    11,
    'Class 2023年10月6日 20:30',
    'Class 2023年10月6日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    78,
    11,
    'Class 2023年10月13日 20:30',
    'Class 2023年10月13日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    79,
    11,
    'Class 2023年10月20日 20:30',
    'Class 2023年10月20日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    80,
    11,
    'Class 2023年10月27日 20:30',
    'Class 2023年10月27日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    81,
    11,
    'Class 2023年11月3日 20:30',
    'Class 2023年11月3日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    82,
    11,
    'Class 2023年11月10日 20:30',
    'Class 2023年11月10日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    83,
    11,
    'Class 2023年11月17日 20:30',
    'Class 2023年11月17日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    84,
    11,
    'Class 2023年11月24日 20:30',
    'Class 2023年11月24日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    85,
    11,
    'Class 2023年12月1日 20:30',
    'Class 2023年12月1日 20:30',
    -1,
    1,
    1695798045281,
    1695798045281
  );

INSERT INTO
  logsCredit
VALUES
  (
    86,
    4,
    'Class 2023年9月30日 18:30',
    'Class 2023年9月30日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    87,
    4,
    'Class 2023年10月7日 18:30',
    'Class 2023年10月7日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    88,
    4,
    'Class 2023年10月14日 18:30',
    'Class 2023年10月14日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    89,
    4,
    'Class 2023年10月21日 18:30',
    'Class 2023年10月21日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    90,
    4,
    'Class 2023年10月28日 18:30',
    'Class 2023年10月28日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    91,
    4,
    'Class 2023年11月4日 18:30',
    'Class 2023年11月4日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    92,
    4,
    'Class 2023年11月11日 18:30',
    'Class 2023年11月11日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    93,
    4,
    'Class 2023年11月18日 18:30',
    'Class 2023年11月18日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    94,
    4,
    'Class 2023年11月25日 18:30',
    'Class 2023年11月25日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    95,
    4,
    'Class 2023年12月2日 18:30',
    'Class 2023年12月2日 18:30',
    -1,
    1,
    1695798058456,
    1695798058456
  );

INSERT INTO
  logsCredit
VALUES
  (
    96,
    10,
    'Class 2023年9月30日 19:00',
    'Class 2023年9月30日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    97,
    10,
    'Class 2023年10月7日 19:00',
    'Class 2023年10月7日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    98,
    10,
    'Class 2023年10月14日 19:00',
    'Class 2023年10月14日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    99,
    10,
    'Class 2023年10月21日 19:00',
    'Class 2023年10月21日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    100,
    10,
    'Class 2023年10月28日 19:00',
    'Class 2023年10月28日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    101,
    10,
    'Class 2023年11月4日 19:00',
    'Class 2023年11月4日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    102,
    10,
    'Class 2023年11月11日 19:00',
    'Class 2023年11月11日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    103,
    10,
    'Class 2023年11月18日 19:00',
    'Class 2023年11月18日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    104,
    10,
    'Class 2023年11月25日 19:00',
    'Class 2023年11月25日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    105,
    10,
    'Class 2023年12月2日 19:00',
    'Class 2023年12月2日 19:00',
    -1,
    1,
    1695798072448,
    1695798072448
  );

INSERT INTO
  logsCredit
VALUES
  (
    106,
    15,
    'Class 2023年9月30日 19:30',
    'Class 2023年9月30日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    107,
    15,
    'Class 2023年10月7日 19:30',
    'Class 2023年10月7日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    108,
    15,
    'Class 2023年10月14日 19:30',
    'Class 2023年10月14日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    109,
    15,
    'Class 2023年10月21日 19:30',
    'Class 2023年10月21日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    110,
    15,
    'Class 2023年10月28日 19:30',
    'Class 2023年10月28日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    111,
    15,
    'Class 2023年11月4日 19:30',
    'Class 2023年11月4日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    112,
    15,
    'Class 2023年11月11日 19:30',
    'Class 2023年11月11日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    113,
    15,
    'Class 2023年11月18日 19:30',
    'Class 2023年11月18日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    114,
    15,
    'Class 2023年11月25日 19:30',
    'Class 2023年11月25日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    115,
    15,
    'Class 2023年12月2日 19:30',
    'Class 2023年12月2日 19:30',
    -1,
    1,
    1695798086478,
    1695798086478
  );

INSERT INTO
  logsCredit
VALUES
  (
    116,
    6,
    'Class 2023年9月30日 20:00',
    'Class 2023年9月30日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    117,
    6,
    'Class 2023年10月7日 20:00',
    'Class 2023年10月7日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    118,
    6,
    'Class 2023年10月14日 20:00',
    'Class 2023年10月14日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    119,
    6,
    'Class 2023年10月21日 20:00',
    'Class 2023年10月21日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    120,
    6,
    'Class 2023年10月28日 20:00',
    'Class 2023年10月28日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    121,
    6,
    'Class 2023年11月4日 20:00',
    'Class 2023年11月4日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    122,
    6,
    'Class 2023年11月11日 20:00',
    'Class 2023年11月11日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    123,
    6,
    'Class 2023年11月18日 20:00',
    'Class 2023年11月18日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    124,
    6,
    'Class 2023年11月25日 20:00',
    'Class 2023年11月25日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    125,
    6,
    'Class 2023年12月2日 20:00',
    'Class 2023年12月2日 20:00',
    -1,
    1,
    1695798100476,
    1695798100476
  );

INSERT INTO
  logsCredit
VALUES
  (
    126,
    12,
    'Class 2023年9月30日 20:30',
    'Class 2023年9月30日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    127,
    12,
    'Class 2023年10月7日 20:30',
    'Class 2023年10月7日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    128,
    12,
    'Class 2023年10月14日 20:30',
    'Class 2023年10月14日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    129,
    12,
    'Class 2023年10月21日 20:30',
    'Class 2023年10月21日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    130,
    12,
    'Class 2023年10月28日 20:30',
    'Class 2023年10月28日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    131,
    12,
    'Class 2023年11月4日 20:30',
    'Class 2023年11月4日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    132,
    12,
    'Class 2023年11月11日 20:30',
    'Class 2023年11月11日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    133,
    12,
    'Class 2023年11月18日 20:30',
    'Class 2023年11月18日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    134,
    12,
    'Class 2023年11月25日 20:30',
    'Class 2023年11月25日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    135,
    12,
    'Class 2023年12月2日 20:30',
    'Class 2023年12月2日 20:30',
    -1,
    1,
    1695798113328,
    1695798113328
  );

INSERT INTO
  logsCredit
VALUES
  (
    136,
    9,
    'Class 2023年9月30日 21:00',
    'Class 2023年9月30日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    137,
    9,
    'Class 2023年10月7日 21:00',
    'Class 2023年10月7日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    138,
    9,
    'Class 2023年10月14日 21:00',
    'Class 2023年10月14日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    139,
    9,
    'Class 2023年10月21日 21:00',
    'Class 2023年10月21日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    140,
    9,
    'Class 2023年10月28日 21:00',
    'Class 2023年10月28日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    141,
    9,
    'Class 2023年11月4日 21:00',
    'Class 2023年11月4日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    142,
    9,
    'Class 2023年11月11日 21:00',
    'Class 2023年11月11日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    143,
    9,
    'Class 2023年11月18日 21:00',
    'Class 2023年11月18日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    144,
    9,
    'Class 2023年11月25日 21:00',
    'Class 2023年11月25日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    145,
    9,
    'Class 2023年12月2日 21:00',
    'Class 2023年12月2日 21:00',
    -1,
    1,
    1695798125090,
    1695798125090
  );

INSERT INTO
  logsCredit
VALUES
  (
    146,
    14,
    'Class 2023年12月9日 21:00',
    'Class 2023年12月9日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    147,
    14,
    'Class 2023年12月16日 21:00',
    'Class 2023年12月16日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    148,
    14,
    'Class 2023年12月23日 21:00',
    'Class 2023年12月23日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    149,
    14,
    'Class 2023年12月30日 21:00',
    'Class 2023年12月30日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    150,
    14,
    'Class 2024年1月6日 21:00',
    'Class 2024年1月6日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    151,
    14,
    'Class 2024年1月13日 21:00',
    'Class 2024年1月13日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    152,
    14,
    'Class 2024年1月20日 21:00',
    'Class 2024年1月20日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    153,
    14,
    'Class 2024年1月27日 21:00',
    'Class 2024年1月27日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    154,
    14,
    'Class 2024年2月3日 21:00',
    'Class 2024年2月3日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    155,
    14,
    'Class 2024年2月10日 21:00',
    'Class 2024年2月10日 21:00',
    -1,
    1,
    1695798133331,
    1695798133331
  );

INSERT INTO
  logsCredit
VALUES
  (
    156,
    9,
    'Class 2023年9月29日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年9月29日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    157,
    9,
    'Class 2023年10月6日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年10月6日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    158,
    9,
    'Class 2023年10月13日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年10月13日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    159,
    9,
    'Class 2023年10月20日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年10月20日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    160,
    9,
    'Class 2023年10月27日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年10月27日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    161,
    9,
    'Class 2023年11月3日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年11月3日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    162,
    9,
    'Class 2023年11月10日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年11月10日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    163,
    9,
    'Class 2023年11月17日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年11月17日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    164,
    9,
    'Class 2023年11月24日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年11月24日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    165,
    9,
    'Class 2023年12月1日 20:00 - Cancelled by admin',
    'Cancelled Class 2023年12月1日 20:00',
    1,
    1,
    1695798278019,
    1695798278019
  );

INSERT INTO
  logsCredit
VALUES
  (
    166,
    11,
    'Class 2023年9月29日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年9月29日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    167,
    11,
    'Class 2023年10月6日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年10月6日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    168,
    11,
    'Class 2023年10月13日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年10月13日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    169,
    11,
    'Class 2023年10月20日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年10月20日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    170,
    11,
    'Class 2023年10月27日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年10月27日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    171,
    11,
    'Class 2023年11月3日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年11月3日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    172,
    11,
    'Class 2023年11月10日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年11月10日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    173,
    11,
    'Class 2023年11月17日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年11月17日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    174,
    11,
    'Class 2023年11月24日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年11月24日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    175,
    11,
    'Class 2023年12月1日 20:30 - Cancelled by admin',
    'Cancelled Class 2023年12月1日 20:30',
    1,
    1,
    1695798331174,
    1695798331174
  );

INSERT INTO
  logsCredit
VALUES
  (
    176,
    9,
    'Class 2023年9月29日 20:30',
    'Class 2023年9月29日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    177,
    9,
    'Class 2023年10月6日 20:30',
    'Class 2023年10月6日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    178,
    9,
    'Class 2023年10月13日 20:30',
    'Class 2023年10月13日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    179,
    9,
    'Class 2023年10月20日 20:30',
    'Class 2023年10月20日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    180,
    9,
    'Class 2023年10月27日 20:30',
    'Class 2023年10月27日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    181,
    9,
    'Class 2023年11月3日 20:30',
    'Class 2023年11月3日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    182,
    9,
    'Class 2023年11月10日 20:30',
    'Class 2023年11月10日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    183,
    9,
    'Class 2023年11月17日 20:30',
    'Class 2023年11月17日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    184,
    9,
    'Class 2023年11月24日 20:30',
    'Class 2023年11月24日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    185,
    9,
    'Class 2023年12月1日 20:30',
    'Class 2023年12月1日 20:30',
    -1,
    1,
    1695798351331,
    1695798351331
  );

INSERT INTO
  logsCredit
VALUES
  (
    186,
    11,
    'Class 2023年9月29日 21:00',
    'Class 2023年9月29日 21:00',
    -1,
    1,
    1695798368108,
    1695798368108
  );

INSERT INTO
  logsCredit
VALUES
  (
    187,
    14,
    'Class 2023年9月30日 21:30',
    'Class 2023年9月30日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    188,
    14,
    'Class 2023年10月7日 21:30',
    'Class 2023年10月7日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    189,
    14,
    'Class 2023年10月14日 21:30',
    'Class 2023年10月14日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    190,
    14,
    'Class 2023年10月21日 21:30',
    'Class 2023年10月21日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    191,
    14,
    'Class 2023年10月28日 21:30',
    'Class 2023年10月28日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    192,
    14,
    'Class 2023年11月4日 21:30',
    'Class 2023年11月4日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    193,
    14,
    'Class 2023年11月11日 21:30',
    'Class 2023年11月11日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    194,
    14,
    'Class 2023年11月18日 21:30',
    'Class 2023年11月18日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    195,
    14,
    'Class 2023年11月25日 21:30',
    'Class 2023年11月25日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    196,
    14,
    'Class 2023年12月2日 21:30',
    'Class 2023年12月2日 21:30',
    -1,
    1,
    1695798382158,
    1695798382158
  );

INSERT INTO
  logsCredit
VALUES
  (
    197,
    7,
    'Class 2023年10月2日 19:00',
    'Class 2023年10月2日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    198,
    7,
    'Class 2023年10月9日 19:00',
    'Class 2023年10月9日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    199,
    7,
    'Class 2023年10月16日 19:00',
    'Class 2023年10月16日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    200,
    7,
    'Class 2023年10月23日 19:00',
    'Class 2023年10月23日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    201,
    7,
    'Class 2023年10月30日 19:00',
    'Class 2023年10月30日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    202,
    7,
    'Class 2023年11月6日 19:00',
    'Class 2023年11月6日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    203,
    7,
    'Class 2023年11月13日 19:00',
    'Class 2023年11月13日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    204,
    7,
    'Class 2023年11月20日 19:00',
    'Class 2023年11月20日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    205,
    7,
    'Class 2023年11月27日 19:00',
    'Class 2023年11月27日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    206,
    7,
    'Class 2023年12月4日 19:00',
    'Class 2023年12月4日 19:00',
    -1,
    1,
    1695798416448,
    1695798416448
  );

INSERT INTO
  logsCredit
VALUES
  (
    207,
    7,
    'Class 2023年9月27日 19:00 - Cancelled by admin',
    'Cancelled Class 2023年9月27日 19:00',
    1,
    1,
    1695799393935,
    1695799393935
  );

INSERT INTO
  logsCredit
VALUES
  (
    208,
    14,
    'Class 2023年10月2日 20:00',
    'Class 2023年10月2日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    209,
    14,
    'Class 2023年10月9日 20:00',
    'Class 2023年10月9日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    210,
    14,
    'Class 2023年10月16日 20:00',
    'Class 2023年10月16日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    211,
    14,
    'Class 2023年10月23日 20:00',
    'Class 2023年10月23日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    212,
    14,
    'Class 2023年10月30日 20:00',
    'Class 2023年10月30日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    213,
    14,
    'Class 2023年11月6日 20:00',
    'Class 2023年11月6日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    214,
    14,
    'Class 2023年11月13日 20:00',
    'Class 2023年11月13日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    215,
    14,
    'Class 2023年11月20日 20:00',
    'Class 2023年11月20日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    216,
    14,
    'Class 2023年11月27日 20:00',
    'Class 2023年11月27日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    217,
    14,
    'Class 2023年12月4日 20:00',
    'Class 2023年12月4日 20:00',
    -1,
    1,
    1695800882215,
    1695800882215
  );

INSERT INTO
  logsCredit
VALUES
  (
    218,
    11,
    'Class 2023年10月6日 21:00',
    'Class 2023年10月6日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    219,
    11,
    'Class 2023年10月13日 21:00',
    'Class 2023年10月13日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    220,
    11,
    'Class 2023年10月20日 21:00',
    'Class 2023年10月20日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    221,
    11,
    'Class 2023年10月27日 21:00',
    'Class 2023年10月27日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    222,
    11,
    'Class 2023年11月3日 21:00',
    'Class 2023年11月3日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    223,
    11,
    'Class 2023年11月10日 21:00',
    'Class 2023年11月10日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    224,
    11,
    'Class 2023年11月17日 21:00',
    'Class 2023年11月17日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    225,
    11,
    'Class 2023年11月24日 21:00',
    'Class 2023年11月24日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

INSERT INTO
  logsCredit
VALUES
  (
    226,
    11,
    'Class 2023年12月1日 21:00',
    'Class 2023年12月1日 21:00',
    -1,
    1,
    1695800902796,
    1695800902796
  );

CREATE TABLE
  funds (
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

INSERT INTO
  funds
VALUES
  (
    1,
    'e61fe93c-9f55-402d-982d-3939450708c1',
    4,
    'Credit Add',
    'Credit Add 100',
    100,
    100,
    'CNY',
    1,
    1,
    1695796082809,
    1695796082809
  );

INSERT INTO
  funds
VALUES
  (
    2,
    '032c024f-e3f7-4855-81e2-2fe964de0972',
    5,
    'Credit Add',
    'Credit Add 100',
    100,
    100,
    'CNY',
    1,
    1,
    1695796090091,
    1695796090091
  );

INSERT INTO
  funds
VALUES
  (
    3,
    'ceb4aa14-cb80-4865-899a-ae7830c33af5',
    6,
    'Credit Add',
    'Credit Add 100',
    100,
    100,
    'CNY',
    1,
    1,
    1695796094139,
    1695796094139
  );

INSERT INTO
  funds
VALUES
  (
    4,
    'b725c716-6b54-4cd6-b4f4-bb609546a7ad',
    11,
    'Credit Add',
    'Credit Add 100',
    100,
    100,
    'CNY',
    1,
    1,
    1695796099554,
    1695796099554
  );

INSERT INTO
  funds
VALUES
  (
    5,
    '4ca175ae-f215-4d2f-b7b8-12cd3f177d9a',
    13,
    'Credit Add',
    'Credit Add 100',
    100,
    100,
    'CNY',
    1,
    1,
    1695796107682,
    1695796107682
  );

CREATE TABLE
  messages (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    messageTemplateId INTEGER NOT NULL,
    userId INTEGER,
    phone TEXT NOT NULL,
    templateValues TEXT,
    cron TEXT NOT NULL,
    sendAt TIMESTAMP,
    status INTEGER NOT NULL, -- 0: inactive, 1: scheduled, 2: successful, 3: failed, 4: recurring -1: deleted
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

CREATE TABLE
  messageTemplates (
    id INTEGER PRIMARY KEY,
    smsId INTEGER NOT NULL, -- ID from SMS service provider
    signature TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    variables TEXT, -- Separated by comma
    status INTEGER NOT NULL, -- 1: active, -1: deleted
    createdById INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  messageTemplates
VALUES
  (
    1,
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

INSERT INTO
  messageTemplates
VALUES
  (
    2,
    'SMS_462685504',
    '恰恰英语',
    'Phone verification',
    '您的手机验证码是#code#，有效期仅5分钟。',
    'code',
    1,
    1,
    1695006169184,
    1695006169184
  );

COMMIT;