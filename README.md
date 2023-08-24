# ESL Website Backend

Project for the ESL Website Backend. This project is built using Cloudflare Workers, and is written in TypeScript.

## Technologies

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)

## Pre-requisites

**Git** and **Node.js** are required to be installed on your machine. It is recommended to use [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions.

> **Note:** This project uses Node.js v19.8.1. If you are using NVM, you can run `nvm install` in the project directory to install the correct version of Node.js.

## Getting Started

1. Clone the repository from GitHub by running `git clone https://github.com/chatchatabc/esl-workers.git` in your terminal or command prompt.
2. Open the project directory by running `cd esl-workers` in your terminal or command prompt.
3. If you are using **NVM**, run `nvm use` to use the correct version of Node.js.
4. Run `npm install` to install the dependencies.

## Development

1. Run `npm run dev` to start the development server
2. Make changes to the code

## Deployment

1. Run `npm run build` to build the project
2. Run `npm run deploy` to deploy the project to Cloudflare Workers

## Database

The database is hosted on Cloudflare D1, which is similar in using SQLite. The schema is as follows:

### Users

| Column Name     | Type                | Description                                  |
| --------------- | ------------------- | -------------------------------------------- |
| id              | INTEGER PRIMARY KEY | The ID of the user                           |
| teacherId       | INTEGER             | The ID of the teacher                        |
| roleId          | INTEGER NOT NULL    | The ID of the role                           |
| username        | TEXT NOT NULL       | The username of the user                     |
| password        | TEXT NOT NULL       | The password of the user                     |
| phone           | TEXT                | The phone of the user                        |
| email           | TEXT                | The email of the user                        |
| firstName       | TEXT                | The first name of user                       |
| lastName        | TEXT                | The last name of user                        |
| alias           | TEXT                | The alias of the user                        |
| phoneVerifiedAt | TIMESTAMP           | The timestamp of when the phone was verified |
| emailVerifiedAt | TIMESTAMP           | The timestamp of when the email was verified |
| credits         | INTEGER NOT NULL    | The credit of the user                       |
| status          | INTEGER NOT NULL    | The status of the user                       |
| createdAt       | TIMESTAMP NOT NULL  | The timestamp of when the user was created   |
| updatedAt       | TIMESTAMP NOT NULL  | The timestamp of when the user was updated   |

### Roles

| Column Name | Type                | Description          |
| ----------- | ------------------- | -------------------- |
| id          | INTEGER PRIMARY KEY | The ID of the role   |
| name        | TEXT NOT NULL       | The name of the role |
| createdAt   | TIMESTAMP NOT NULL  | The timestamp        |
| updatedAt   | TIMESTAMP NOT NULL  | The timestamp        |

### Teachers

| Column Name | Type                | Description              |
| ----------- | ------------------- | ------------------------ |
| id          | INTEGER PRIMARY KEY | The ID of the teacher    |
| videoId     | INTEGER             | The video ID of the user |
| alias       | TEXT NOT NULL       | The alias of the user    |
| bio         | TEXT                | The bio of the user      |
| createdAt   | TIMESTAMP NOT NULL  | The timestamp            |
| updatedAt   | TIMESTAMP NOT NULL  | The timestamp            |

### Courses

| Column Name | Type                | Description             |
| ----------- | ------------------- | ----------------------- |
| id          | INTEGER PRIMARY KEY | The ID of the course    |
| teacherId   | INTEGER NOT NULL    | The ID of the teacher   |
| name        | TEXT NOT NULL       | The name of the course  |
| price       | INTEGER NOT NULL    | The price of the course |
| createdAt   | TIMESTAMP NOT NULL  | The timestamp           |
| updatedAt   | TIMESTAMP NOT NULL  | The timestamp           |

### Schedules

| Column Name | Type                | Description            |
| ----------- | ------------------- | ---------------------- |
| id          | INTEGER PRIMARY KEY | The ID of the schedule |
| teacherId   | INTEGER NOT NULL    | The ID of the teacher  |
| title       | TEXT NOT NULL       | The name of the course |
| day         | INTEGER NOT NULL    | The day of the week    |
| startTime   | TIMESTAMP NOT NULL  | The start time         |
| endTime     | TIMESTAMP NOT NULL  | The end time           |
| createdAt   | TIMESTAMP NOT NULL  | The timestamp          |
| updatedAt   | TIMESTAMP NOT NULL  | The timestamp          |

### Bookings

| Column Name | Type                | Description           |
| ----------- | ------------------- | --------------------- |
| id          | INTEGER PRIMARY KEY | The ID of the booking |
| userId      | INTEGER NOT NULL    | The ID of the user    |
| courseId    | INTEGER NOT NULL    | The ID of the course  |
| teacherId   | INTEGER NOT NULL    | The ID of the teacher |
| createdAt   | TIMESTAMP NOT NULL  | The timestamp         |
| updatedAt   | TIMESTAMP NOT NULL  | The timestamp         |
