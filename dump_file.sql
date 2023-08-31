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
    0,
    NULL,
    1000,
    1,
    0,
    0
  );

INSERT INTO
  users
VALUES
  (
    2,
    2,
    'student',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+8618832258785',
    NULL,
    'Joy',
    'Liu',
    'JoyGwapo',
    0,
    NULL,
    1000,
    1,
    0,
    1693448818742
  );

INSERT INTO
  users
VALUES
  (
    3,
    3,
    'teacher',
    'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3',
    '+8618832258785',
    NULL,
    'Michele',
    'Surname',
    'Teacher Michelle',
    0,
    NULL,
    1050,
    1,
    0,
    1693449171373
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
    NULL,
    1693447867561,
    NULL,
    10,
    1,
    1693447867565,
    1693447899404
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
    NULL,
    1693448395823,
    NULL,
    0,
    1,
    1693448395826,
    1693449819448
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
    NULL,
    1693448417289,
    NULL,
    190,
    1,
    1693448417292,
    1693449852301
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
    NULL,
    1693448439354,
    NULL,
    189,
    1,
    1693448439356,
    1693449837050
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
    NULL,
    1693448472888,
    NULL,
    200,
    1,
    1693448472890,
    1693449683881
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
    NULL,
    1693448499781,
    NULL,
    200,
    1,
    1693448499783,
    1693449694338
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
    NULL,
    1693448523278,
    NULL,
    200,
    1,
    1693448523282,
    1693449698037
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
    NULL,
    1693448544021,
    NULL,
    0,
    1,
    1693448544023,
    1693450053711
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
    NULL,
    1693448579568,
    NULL,
    200,
    1,
    1693448579571,
    1693449703633
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
    NULL,
    1693448605225,
    NULL,
    0,
    1,
    1693448605228,
    1693449872036
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
    NULL,
    1693448627656,
    NULL,
    197,
    1,
    1693448627658,
    1693449901314
  );

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
  teachers
VALUES
  (
    1,
    3,
    'Teacher Michelle',
    'I am a teacher',
    1,
    0,
    0
  );

CREATE TABLE
  IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    teacherId INTEGER NOT NULL,
    price INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  courses
VALUES
  (
    1,
    1,
    1,
    'Normal Class',
    'Normal Class',
    0,
    1693448731564
  );

CREATE TABLE
  IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  roles
VALUES
  (1, 'admin', 0, 0);

INSERT INTO
  roles
VALUES
  (2, 'student', 0, 0);

INSERT INTO
  roles
VALUES
  (3, 'teacher', 0, 0);

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

INSERT INTO
  schedules
VALUES
  (
    1,
    1,
    381600000,
    396000000,
    4,
    1693447952196,
    1693449620257
  );

INSERT INTO
  schedules
VALUES
  (
    2,
    1,
    468000000,
    482400000,
    5,
    1693448887366,
    1693449620257
  );

INSERT INTO
  schedules
VALUES
  (
    3,
    1,
    554400000,
    568800000,
    6,
    1693448887366,
    1693449620257
  );

INSERT INTO
  schedules
VALUES
  (
    4,
    1,
    295200000,
    309600000,
    3,
    1693449620274,
    1693449620274
  );

INSERT INTO
  schedules
VALUES
  (
    5,
    1,
    208800000,
    223200000,
    2,
    1693449620274,
    1693449620274
  );

INSERT INTO
  schedules
VALUES
  (
    6,
    1,
    122400000,
    136800000,
    1,
    1693449620274,
    1693449620274
  );

CREATE TABLE
  IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    courseId INTEGER NOT NULL,
    teacherId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    end TIMESTAMP NOT NULL,
    status INTEGER NOT NULL, -- 1: pending, 2: confirmed, 3: completed, 4: cancelled, 5: absent, 6: expired, -1: deleted
    message TEXT,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  bookings
VALUES
  (
    1,
    1,
    1,
    2,
    50,
    1693449000000,
    1693450800000,
    4,
    NULL,
    1693447993321,
    1693448812390
  );

INSERT INTO
  bookings
VALUES
  (
    2,
    1,
    1,
    2,
    50,
    1693463400000,
    1693465200000,
    4,
    NULL,
    1693448038491,
    1693448818742
  );

INSERT INTO
  bookings
VALUES
  (
    3,
    1,
    1,
    8,
    1,
    1693479600000,
    1693481400000,
    4,
    NULL,
    1693448980870,
    1693449001080
  );

INSERT INTO
  bookings
VALUES
  (
    4,
    1,
    1,
    8,
    1,
    1693479600000,
    1693481400000,
    4,
    NULL,
    1693449102962,
    1693449140439
  );

INSERT INTO
  bookings
VALUES
  (
    5,
    1,
    1,
    8,
    1,
    1694084400000,
    1694086200000,
    4,
    NULL,
    1693449102962,
    1693449171373
  );

INSERT INTO
  bookings
VALUES
  (
    6,
    1,
    1,
    8,
    1,
    1693479600000,
    1693481400000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    7,
    1,
    1,
    8,
    1,
    1694084400000,
    1694086200000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    8,
    1,
    1,
    8,
    1,
    1694689200000,
    1694691000000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    9,
    1,
    1,
    8,
    1,
    1695294000000,
    1695295800000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    10,
    1,
    1,
    8,
    1,
    1695898800000,
    1695900600000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    11,
    1,
    1,
    8,
    1,
    1696503600000,
    1696505400000,
    1,
    NULL,
    1693449202618,
    1693449202618
  );

INSERT INTO
  bookings
VALUES
  (
    12,
    1,
    1,
    8,
    1,
    1697108400000,
    1697110200000,
    1,
    NULL,
    1693449202619,
    1693449202619
  );

INSERT INTO
  bookings
VALUES
  (
    13,
    1,
    1,
    8,
    1,
    1697713200000,
    1697715000000,
    1,
    NULL,
    1693449202619,
    1693449202619
  );

INSERT INTO
  bookings
VALUES
  (
    14,
    1,
    1,
    8,
    1,
    1698318000000,
    1698319800000,
    1,
    NULL,
    1693449202619,
    1693449202619
  );

INSERT INTO
  bookings
VALUES
  (
    15,
    1,
    1,
    8,
    1,
    1698922800000,
    1698924600000,
    1,
    NULL,
    1693449202619,
    1693449202619
  );

INSERT INTO
  bookings
VALUES
  (
    16,
    1,
    1,
    7,
    1,
    1693562400000,
    1693564200000,
    1,
    NULL,
    1693449373088,
    1693449373088
  );

INSERT INTO
  bookings
VALUES
  (
    17,
    1,
    1,
    14,
    1,
    1693569600000,
    1693571400000,
    1,
    NULL,
    1693449398308,
    1693449398308
  );

INSERT INTO
  bookings
VALUES
  (
    18,
    1,
    1,
    9,
    1,
    1693571400000,
    1693573200000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    19,
    1,
    1,
    9,
    1,
    1694176200000,
    1694178000000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    20,
    1,
    1,
    9,
    1,
    1694781000000,
    1694782800000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    21,
    1,
    1,
    9,
    1,
    1695385800000,
    1695387600000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    22,
    1,
    1,
    9,
    1,
    1695990600000,
    1695992400000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    23,
    1,
    1,
    9,
    1,
    1696595400000,
    1696597200000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    24,
    1,
    1,
    9,
    1,
    1697200200000,
    1697202000000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    25,
    1,
    1,
    9,
    1,
    1697805000000,
    1697806800000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    26,
    1,
    1,
    9,
    1,
    1698409800000,
    1698411600000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    27,
    1,
    1,
    9,
    1,
    1699014600000,
    1699016400000,
    1,
    NULL,
    1693449419683,
    1693449419683
  );

INSERT INTO
  bookings
VALUES
  (
    28,
    1,
    1,
    10,
    1,
    1693652400000,
    1693654200000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    29,
    1,
    1,
    10,
    1,
    1694257200000,
    1694259000000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    30,
    1,
    1,
    10,
    1,
    1694862000000,
    1694863800000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    31,
    1,
    1,
    10,
    1,
    1695466800000,
    1695468600000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    32,
    1,
    1,
    10,
    1,
    1696071600000,
    1696073400000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    33,
    1,
    1,
    10,
    1,
    1696676400000,
    1696678200000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    34,
    1,
    1,
    10,
    1,
    1697281200000,
    1697283000000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    35,
    1,
    1,
    10,
    1,
    1697886000000,
    1697887800000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    36,
    1,
    1,
    10,
    1,
    1698490800000,
    1698492600000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    37,
    1,
    1,
    10,
    1,
    1699095600000,
    1699097400000,
    1,
    NULL,
    1693449443814,
    1693449443814
  );

INSERT INTO
  bookings
VALUES
  (
    38,
    1,
    1,
    6,
    1,
    1693656000000,
    1693657800000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    39,
    1,
    1,
    6,
    1,
    1694260800000,
    1694262600000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    40,
    1,
    1,
    6,
    1,
    1694865600000,
    1694867400000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    41,
    1,
    1,
    6,
    1,
    1695470400000,
    1695472200000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    42,
    1,
    1,
    6,
    1,
    1696075200000,
    1696077000000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    43,
    1,
    1,
    6,
    1,
    1696680000000,
    1696681800000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    44,
    1,
    1,
    6,
    1,
    1697284800000,
    1697286600000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    45,
    1,
    1,
    6,
    1,
    1697889600000,
    1697891400000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    46,
    1,
    1,
    6,
    1,
    1698494400000,
    1698496200000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    47,
    1,
    1,
    6,
    1,
    1699099200000,
    1699101000000,
    1,
    NULL,
    1693449461989,
    1693449461989
  );

INSERT INTO
  bookings
VALUES
  (
    48,
    1,
    1,
    12,
    1,
    1693657800000,
    1693659600000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    49,
    1,
    1,
    12,
    1,
    1694262600000,
    1694264400000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    50,
    1,
    1,
    12,
    1,
    1694867400000,
    1694869200000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    51,
    1,
    1,
    12,
    1,
    1695472200000,
    1695474000000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    52,
    1,
    1,
    12,
    1,
    1696077000000,
    1696078800000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    53,
    1,
    1,
    12,
    1,
    1696681800000,
    1696683600000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    54,
    1,
    1,
    12,
    1,
    1697286600000,
    1697288400000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    55,
    1,
    1,
    12,
    1,
    1697891400000,
    1697893200000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    56,
    1,
    1,
    12,
    1,
    1698496200000,
    1698498000000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    57,
    1,
    1,
    12,
    1,
    1699101000000,
    1699102800000,
    1,
    NULL,
    1693449494163,
    1693449494163
  );

INSERT INTO
  bookings
VALUES
  (
    58,
    1,
    1,
    9,
    1,
    1693659600000,
    1693661400000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    59,
    1,
    1,
    9,
    1,
    1694264400000,
    1694266200000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    60,
    1,
    1,
    9,
    1,
    1694869200000,
    1694871000000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    61,
    1,
    1,
    9,
    1,
    1695474000000,
    1695475800000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    62,
    1,
    1,
    9,
    1,
    1696078800000,
    1696080600000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    63,
    1,
    1,
    9,
    1,
    1696683600000,
    1696685400000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    64,
    1,
    1,
    9,
    1,
    1697288400000,
    1697290200000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    65,
    1,
    1,
    9,
    1,
    1697893200000,
    1697895000000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    66,
    1,
    1,
    9,
    1,
    1698498000000,
    1698499800000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    67,
    1,
    1,
    9,
    1,
    1699102800000,
    1699104600000,
    1,
    NULL,
    1693449571883,
    1693449571883
  );

INSERT INTO
  bookings
VALUES
  (
    68,
    1,
    1,
    7,
    1,
    1693825200000,
    1693827000000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    69,
    1,
    1,
    7,
    1,
    1694430000000,
    1694431800000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    70,
    1,
    1,
    7,
    1,
    1695034800000,
    1695036600000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    71,
    1,
    1,
    7,
    1,
    1695639600000,
    1695641400000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    72,
    1,
    1,
    7,
    1,
    1696244400000,
    1696246200000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    73,
    1,
    1,
    7,
    1,
    1696849200000,
    1696851000000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    74,
    1,
    1,
    7,
    1,
    1697454000000,
    1697455800000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    75,
    1,
    1,
    7,
    1,
    1698058800000,
    1698060600000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    76,
    1,
    1,
    7,
    1,
    1698663600000,
    1698665400000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    77,
    1,
    1,
    7,
    1,
    1699268400000,
    1699270200000,
    1,
    NULL,
    1693449740087,
    1693449740087
  );

INSERT INTO
  bookings
VALUES
  (
    78,
    1,
    1,
    14,
    1,
    1693828800000,
    1693830600000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    79,
    1,
    1,
    14,
    1,
    1694433600000,
    1694435400000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    80,
    1,
    1,
    14,
    1,
    1695038400000,
    1695040200000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    81,
    1,
    1,
    14,
    1,
    1695643200000,
    1695645000000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    82,
    1,
    1,
    14,
    1,
    1696248000000,
    1696249800000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    83,
    1,
    1,
    14,
    1,
    1696852800000,
    1696854600000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    84,
    1,
    1,
    14,
    1,
    1697457600000,
    1697459400000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    85,
    1,
    1,
    14,
    1,
    1698062400000,
    1698064200000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    86,
    1,
    1,
    14,
    1,
    1698667200000,
    1698669000000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    87,
    1,
    1,
    14,
    1,
    1699272000000,
    1699273800000,
    1,
    NULL,
    1693449768319,
    1693449768319
  );

INSERT INTO
  bookings
VALUES
  (
    88,
    1,
    1,
    14,
    1,
    1693915200000,
    1693917000000,
    1,
    NULL,
    1693449802200,
    1693449802200
  );

INSERT INTO
  bookings
VALUES
  (
    89,
    1,
    1,
    5,
    1,
    1693994400000,
    1693996200000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    90,
    1,
    1,
    5,
    1,
    1694599200000,
    1694601000000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    91,
    1,
    1,
    5,
    1,
    1695204000000,
    1695205800000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    92,
    1,
    1,
    5,
    1,
    1695808800000,
    1695810600000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    93,
    1,
    1,
    5,
    1,
    1696413600000,
    1696415400000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    94,
    1,
    1,
    5,
    1,
    1697018400000,
    1697020200000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    95,
    1,
    1,
    5,
    1,
    1697623200000,
    1697625000000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    96,
    1,
    1,
    5,
    1,
    1698228000000,
    1698229800000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    97,
    1,
    1,
    5,
    1,
    1698832800000,
    1698834600000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    98,
    1,
    1,
    5,
    1,
    1699437600000,
    1699439400000,
    1,
    NULL,
    1693449819448,
    1693449819448
  );

INSERT INTO
  bookings
VALUES
  (
    99,
    1,
    1,
    7,
    1,
    1693998000000,
    1693999800000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    100,
    1,
    1,
    7,
    1,
    1694602800000,
    1694604600000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    101,
    1,
    1,
    7,
    1,
    1695207600000,
    1695209400000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    102,
    1,
    1,
    7,
    1,
    1695812400000,
    1695814200000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    103,
    1,
    1,
    7,
    1,
    1696417200000,
    1696419000000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    104,
    1,
    1,
    7,
    1,
    1697022000000,
    1697023800000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    105,
    1,
    1,
    7,
    1,
    1697626800000,
    1697628600000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    106,
    1,
    1,
    7,
    1,
    1698231600000,
    1698233400000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    107,
    1,
    1,
    7,
    1,
    1698836400000,
    1698838200000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    108,
    1,
    1,
    7,
    1,
    1699441200000,
    1699443000000,
    1,
    NULL,
    1693449837050,
    1693449837050
  );

INSERT INTO
  bookings
VALUES
  (
    109,
    1,
    1,
    6,
    1,
    1693999800000,
    1694001600000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    110,
    1,
    1,
    6,
    1,
    1694604600000,
    1694606400000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    111,
    1,
    1,
    6,
    1,
    1695209400000,
    1695211200000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    112,
    1,
    1,
    6,
    1,
    1695814200000,
    1695816000000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    113,
    1,
    1,
    6,
    1,
    1696419000000,
    1696420800000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    114,
    1,
    1,
    6,
    1,
    1697023800000,
    1697025600000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    115,
    1,
    1,
    6,
    1,
    1697628600000,
    1697630400000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    116,
    1,
    1,
    6,
    1,
    1698233400000,
    1698235200000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    117,
    1,
    1,
    6,
    1,
    1698838200000,
    1698840000000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    118,
    1,
    1,
    6,
    1,
    1699443000000,
    1699444800000,
    1,
    NULL,
    1693449852301,
    1693449852301
  );

INSERT INTO
  bookings
VALUES
  (
    119,
    1,
    1,
    13,
    1,
    1694001600000,
    1694003400000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    120,
    1,
    1,
    13,
    1,
    1694606400000,
    1694608200000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    121,
    1,
    1,
    13,
    1,
    1695211200000,
    1695213000000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    122,
    1,
    1,
    13,
    1,
    1695816000000,
    1695817800000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    123,
    1,
    1,
    13,
    1,
    1696420800000,
    1696422600000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    124,
    1,
    1,
    13,
    1,
    1697025600000,
    1697027400000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    125,
    1,
    1,
    13,
    1,
    1697630400000,
    1697632200000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    126,
    1,
    1,
    13,
    1,
    1698235200000,
    1698237000000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    127,
    1,
    1,
    13,
    1,
    1698840000000,
    1698841800000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    128,
    1,
    1,
    13,
    1,
    1699444800000,
    1699446600000,
    1,
    NULL,
    1693449872036,
    1693449872036
  );

INSERT INTO
  bookings
VALUES
  (
    129,
    1,
    1,
    14,
    1,
    1694174400000,
    1694176200000,
    1,
    NULL,
    1693449901314,
    1693449901314
  );

INSERT INTO
  bookings
VALUES
  (
    130,
    1,
    1,
    11,
    1,
    1694178000000,
    1694179800000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    131,
    1,
    1,
    11,
    1,
    1694782800000,
    1694784600000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    132,
    1,
    1,
    11,
    1,
    1695387600000,
    1695389400000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    133,
    1,
    1,
    11,
    1,
    1695992400000,
    1695994200000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    134,
    1,
    1,
    11,
    1,
    1696597200000,
    1696599000000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    135,
    1,
    1,
    11,
    1,
    1697202000000,
    1697203800000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    136,
    1,
    1,
    11,
    1,
    1697806800000,
    1697808600000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    137,
    1,
    1,
    11,
    1,
    1698411600000,
    1698413400000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    138,
    1,
    1,
    11,
    1,
    1699016400000,
    1699018200000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    139,
    1,
    1,
    11,
    1,
    1699621200000,
    1699623000000,
    1,
    NULL,
    1693449913997,
    1693449913997
  );

INSERT INTO
  bookings
VALUES
  (
    140,
    1,
    1,
    11,
    1,
    1693573200000,
    1693575000000,
    1,
    NULL,
    1693450053711,
    1693450053711
  );

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

INSERT INTO
  logsCredit
VALUES
  (
    1,
    4,
    'Credit Add',
    'Credit Add 10',
    10,
    1693447899404,
    1693447899404
  );

INSERT INTO
  logsCredit
VALUES
  (
    2,
    2,
    'Class 2023年8月31日 10:30',
    'Class 2023年8月31日 10:30',
    -50,
    1693447993321,
    1693447993321
  );

INSERT INTO
  logsCredit
VALUES
  (
    3,
    3,
    'Class Completed',
    'Class 2023年8月31日 10:30 Completed',
    50,
    1693448021835,
    1693448021835
  );

INSERT INTO
  logsCredit
VALUES
  (
    4,
    2,
    'Class 2023年8月31日 14:30',
    'Class 2023年8月31日 14:30',
    -50,
    1693448038491,
    1693448038491
  );

INSERT INTO
  logsCredit
VALUES
  (
    5,
    3,
    'Class Completed',
    'Class 2023年8月31日 14:30 Completed',
    50,
    1693448123177,
    1693448123177
  );

INSERT INTO
  logsCredit
VALUES
  (
    6,
    3,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 10:30',
    -50,
    1693448165510,
    1693448165510
  );

INSERT INTO
  logsCredit
VALUES
  (
    7,
    3,
    'Booked class from student JoyGwapo',
    'Booked class at Aug 31, 2023 10:30 AM',
    50,
    1693448215545,
    1693448215545
  );

INSERT INTO
  logsCredit
VALUES
  (
    8,
    5,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448750999,
    1693448750999
  );

INSERT INTO
  logsCredit
VALUES
  (
    9,
    6,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448755304,
    1693448755304
  );

INSERT INTO
  logsCredit
VALUES
  (
    10,
    7,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448759467,
    1693448759467
  );

INSERT INTO
  logsCredit
VALUES
  (
    11,
    8,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448764949,
    1693448764949
  );

INSERT INTO
  logsCredit
VALUES
  (
    12,
    9,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448769985,
    1693448769985
  );

INSERT INTO
  logsCredit
VALUES
  (
    13,
    10,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448774371,
    1693448774371
  );

INSERT INTO
  logsCredit
VALUES
  (
    14,
    11,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448778833,
    1693448778833
  );

INSERT INTO
  logsCredit
VALUES
  (
    15,
    12,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448782288,
    1693448782288
  );

INSERT INTO
  logsCredit
VALUES
  (
    16,
    13,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448785952,
    1693448785952
  );

INSERT INTO
  logsCredit
VALUES
  (
    17,
    14,
    'Credit Add',
    'Credit Add 10',
    10,
    1693448789562,
    1693448789562
  );

INSERT INTO
  logsCredit
VALUES
  (
    18,
    2,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 10:30',
    50,
    1693448812390,
    1693448812390
  );

INSERT INTO
  logsCredit
VALUES
  (
    19,
    3,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 14:30',
    -50,
    1693448818742,
    1693448818742
  );

INSERT INTO
  logsCredit
VALUES
  (
    20,
    2,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 14:30',
    50,
    1693448818742,
    1693448818742
  );

INSERT INTO
  logsCredit
VALUES
  (
    21,
    8,
    'Recurring Class from 2023年8月31日 to 2023年9月7日 @ 19:00 - 19:30',
    'Recurring Class from 2023年8月31日 to 2023年9月7日 @ 19:00 - 19:30',
    -1,
    1693448980869,
    1693448980869
  );

INSERT INTO
  logsCredit
VALUES
  (
    22,
    8,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 19:00',
    1,
    1693449001080,
    1693449001080
  );

INSERT INTO
  logsCredit
VALUES
  (
    23,
    8,
    'Recurring Class from 2023年8月31日 to 2023年9月14日 @ 19:00 - 19:30',
    'Recurring Class from 2023年8月31日 to 2023年9月14日 @ 19:00 - 19:30',
    -2,
    1693449102962,
    1693449102962
  );

INSERT INTO
  logsCredit
VALUES
  (
    24,
    8,
    'Cancelled Class',
    'Cancelled Class 2023年8月31日 19:00',
    1,
    1693449140439,
    1693449140439
  );

INSERT INTO
  logsCredit
VALUES
  (
    25,
    8,
    'Cancelled Class',
    'Cancelled Class 2023年9月7日 19:00',
    1,
    1693449171373,
    1693449171373
  );

INSERT INTO
  logsCredit
VALUES
  (
    26,
    8,
    'Recurring Class from 2023年8月31日 to 2023年11月9日 @ 19:00 - 19:30',
    'Recurring Class from 2023年8月31日 to 2023年11月9日 @ 19:00 - 19:30',
    -10,
    1693449202618,
    1693449202618
  );

INSERT INTO
  logsCredit
VALUES
  (
    27,
    7,
    'Recurring Class from 2023年9月1日 to 2023年9月8日 @ 18:00 - 18:30',
    'Recurring Class from 2023年9月1日 to 2023年9月8日 @ 18:00 - 18:30',
    -1,
    1693449373088,
    1693449373088
  );

INSERT INTO
  logsCredit
VALUES
  (
    28,
    14,
    'Class 2023年9月1日 20:00',
    'Class 2023年9月1日 20:00',
    -1,
    1693449398308,
    1693449398308
  );

INSERT INTO
  logsCredit
VALUES
  (
    29,
    9,
    'Recurring Class from 2023年9月1日 to 2023年11月10日 @ 20:30 - 21:00',
    'Recurring Class from 2023年9月1日 to 2023年11月10日 @ 20:30 - 21:00',
    -10,
    1693449419683,
    1693449419683
  );

INSERT INTO
  logsCredit
VALUES
  (
    30,
    10,
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 19:00 - 19:30',
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 19:00 - 19:30',
    -10,
    1693449443814,
    1693449443814
  );

INSERT INTO
  logsCredit
VALUES
  (
    31,
    6,
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 20:00 - 20:30',
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 20:00 - 20:30',
    -10,
    1693449461989,
    1693449461989
  );

INSERT INTO
  logsCredit
VALUES
  (
    32,
    12,
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 20:30 - 21:00',
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 20:30 - 21:00',
    -10,
    1693449494163,
    1693449494163
  );

INSERT INTO
  logsCredit
VALUES
  (
    33,
    9,
    'Credit Add',
    'Credit Add 10',
    10,
    1693449552923,
    1693449552923
  );

INSERT INTO
  logsCredit
VALUES
  (
    34,
    9,
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 21:00 - 21:30',
    'Recurring Class from 2023年9月2日 to 2023年11月11日 @ 21:00 - 21:30',
    -10,
    1693449571883,
    1693449571883
  );

INSERT INTO
  logsCredit
VALUES
  (
    35,
    7,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449669945,
    1693449669945
  );

INSERT INTO
  logsCredit
VALUES
  (
    36,
    8,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449683881,
    1693449683881
  );

INSERT INTO
  logsCredit
VALUES
  (
    37,
    6,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449689149,
    1693449689149
  );

INSERT INTO
  logsCredit
VALUES
  (
    38,
    9,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449694338,
    1693449694338
  );

INSERT INTO
  logsCredit
VALUES
  (
    39,
    10,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449698037,
    1693449698037
  );

INSERT INTO
  logsCredit
VALUES
  (
    40,
    12,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449703633,
    1693449703633
  );

INSERT INTO
  logsCredit
VALUES
  (
    41,
    14,
    'Credit Add',
    'Credit Add 200',
    200,
    1693449706730,
    1693449706730
  );

INSERT INTO
  logsCredit
VALUES
  (
    42,
    7,
    'Recurring Class from 2023年9月4日 to 2023年11月13日 @ 19:00 - 19:30',
    'Recurring Class from 2023年9月4日 to 2023年11月13日 @ 19:00 - 19:30',
    -10,
    1693449740087,
    1693449740087
  );

INSERT INTO
  logsCredit
VALUES
  (
    43,
    14,
    'Recurring Class from 2023年9月4日 to 2023年11月13日 @ 20:00 - 20:30',
    'Recurring Class from 2023年9月4日 to 2023年11月13日 @ 20:00 - 20:30',
    -10,
    1693449768319,
    1693449768319
  );

INSERT INTO
  logsCredit
VALUES
  (
    44,
    14,
    'Recurring Class from 2023年9月5日 to 2023年9月12日 @ 20:00 - 20:30',
    'Recurring Class from 2023年9月5日 to 2023年9月12日 @ 20:00 - 20:30',
    -1,
    1693449802200,
    1693449802200
  );

INSERT INTO
  logsCredit
VALUES
  (
    45,
    5,
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 18:00 - 18:30',
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 18:00 - 18:30',
    -10,
    1693449819448,
    1693449819448
  );

INSERT INTO
  logsCredit
VALUES
  (
    46,
    7,
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 19:00 - 19:30',
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 19:00 - 19:30',
    -10,
    1693449837050,
    1693449837050
  );

INSERT INTO
  logsCredit
VALUES
  (
    47,
    6,
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 19:30 - 20:00',
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 19:30 - 20:00',
    -10,
    1693449852301,
    1693449852301
  );

INSERT INTO
  logsCredit
VALUES
  (
    48,
    13,
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 20:00 - 20:30',
    'Recurring Class from 2023年9月6日 to 2023年11月15日 @ 20:00 - 20:30',
    -10,
    1693449872036,
    1693449872036
  );

INSERT INTO
  logsCredit
VALUES
  (
    49,
    14,
    'Recurring Class from 2023年9月8日 to 2023年9月15日 @ 20:00 - 20:30',
    'Recurring Class from 2023年9月8日 to 2023年9月15日 @ 20:00 - 20:30',
    -1,
    1693449901314,
    1693449901314
  );

INSERT INTO
  logsCredit
VALUES
  (
    50,
    11,
    'Recurring Class from 2023年9月8日 to 2023年11月17日 @ 21:00 - 21:30',
    'Recurring Class from 2023年9月8日 to 2023年11月17日 @ 21:00 - 21:30',
    -10,
    1693449913997,
    1693449913997
  );

INSERT INTO
  logsCredit
VALUES
  (
    51,
    11,
    'Credit Add',
    'Credit Add 1',
    1,
    1693450037936,
    1693450037936
  );

INSERT INTO
  logsCredit
VALUES
  (
    52,
    11,
    'Recurring Class from 2023年9月1日 to 2023年9月8日 @ 21:00 - 21:30',
    'Recurring Class from 2023年9月1日 to 2023年9月8日 @ 21:00 - 21:30',
    -1,
    1693450053711,
    1693450053711
  );

CREATE TABLE
  IF NOT EXISTS logsMoney (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    credits INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  logsMoney
VALUES
  (
    1,
    4,
    'Credit Add',
    'Credit Add 10',
    10,
    1000,
    'CNY',
    1693447899404,
    1693447899404
  );

INSERT INTO
  logsMoney
VALUES
  (
    2,
    5,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448750999,
    1693448750999
  );

INSERT INTO
  logsMoney
VALUES
  (
    3,
    6,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448755304,
    1693448755304
  );

INSERT INTO
  logsMoney
VALUES
  (
    4,
    7,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448759467,
    1693448759467
  );

INSERT INTO
  logsMoney
VALUES
  (
    5,
    8,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448764949,
    1693448764949
  );

INSERT INTO
  logsMoney
VALUES
  (
    6,
    9,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448769985,
    1693448769985
  );

INSERT INTO
  logsMoney
VALUES
  (
    7,
    10,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448774371,
    1693448774371
  );

INSERT INTO
  logsMoney
VALUES
  (
    8,
    11,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448778833,
    1693448778833
  );

INSERT INTO
  logsMoney
VALUES
  (
    9,
    12,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448782288,
    1693448782288
  );

INSERT INTO
  logsMoney
VALUES
  (
    10,
    13,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448785952,
    1693448785952
  );

INSERT INTO
  logsMoney
VALUES
  (
    11,
    14,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693448789562,
    1693448789562
  );

INSERT INTO
  logsMoney
VALUES
  (
    12,
    9,
    'Credit Add',
    'Credit Add 10',
    10,
    10,
    'CNY',
    1693449552923,
    1693449552923
  );

INSERT INTO
  logsMoney
VALUES
  (
    13,
    7,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449669945,
    1693449669945
  );

INSERT INTO
  logsMoney
VALUES
  (
    14,
    8,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449683881,
    1693449683881
  );

INSERT INTO
  logsMoney
VALUES
  (
    15,
    6,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449689149,
    1693449689149
  );

INSERT INTO
  logsMoney
VALUES
  (
    16,
    9,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449694338,
    1693449694338
  );

INSERT INTO
  logsMoney
VALUES
  (
    17,
    10,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449698037,
    1693449698037
  );

INSERT INTO
  logsMoney
VALUES
  (
    18,
    12,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449703633,
    1693449703633
  );

INSERT INTO
  logsMoney
VALUES
  (
    19,
    14,
    'Credit Add',
    'Credit Add 200',
    200,
    200,
    'CNY',
    1693449706730,
    1693449706730
  );

INSERT INTO
  logsMoney
VALUES
  (
    20,
    11,
    'Credit Add',
    'Credit Add 1',
    1,
    1,
    'CNY',
    1693450037936,
    1693450037936
  );

CREATE TABLE
  IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    messageTemplateId INTEGER NOT NULL,
    userId INTEGER,
    phone TEXT NOT NULL,
    templateValues TEXT,
    cron TEXT NOT NULL,
    sendAt TIMESTAMP,
    status INTEGER NOT NULL, -- 0: inactive, 1: scheduled, 2: successful, 3: failed, 4: recurring -1: deleted
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  );

INSERT INTO
  messages
VALUES
  (
    1,
    1,
    2,
    '+8618832258785',
    '{"datetime":"2023年8月31日 10:30"}',
    '0 0 1 1 1',
    1693448400000,
    2,
    1693448215545,
    1693448217365
  );

CREATE TABLE
  IF NOT EXISTS messageTemplates (
    id INTEGER PRIMARY KEY,
    smsId INTEGER NOT NULL, -- ID from SMS service provider
    signature TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    variables TEXT, -- Separated by comma
    status INTEGER NOT NULL, -- 1: active, -1: deleted
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
    0,
    0
  );

COMMIT;