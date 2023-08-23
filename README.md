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
| username        | TEXT NOT NULL       | The username of the user                     |
| password        | TEXT NOT NULL       | The password of the user                     |
| phone           | TEXT                | The phone of the user                        |
| email           | TEXT                | The email of the user                        |
| firstName       | TEXT                | The first name of user                       |
| lastName        | TEXT                | The last name of user                        |
| roleId          | INTEGER NOT NULL    | The role ID of the user                      |
| status          | INTEGER NOT NULL    | The status of the user                       |
| credit          | INTEGER NOT NULL    | The credit of the user                       |
| phoneVerifiedAt | INTEGER             | The timestamp of when the phone was verified |
| emailVerifiedAt | INTEGER             | The timestamp of when the email was verified |
| createdAt       | INTEGER NOT NULL    | The timestamp of when the user was created   |
| updatedAt       | INTEGER NOT NULL    | The timestamp of when the user was updated   |

### Roles

| Column Name | Type                | Description          |
| ----------- | ------------------- | -------------------- |
| id          | INTEGER PRIMARY KEY | The ID of the role   |
| name        | TEXT NOT NULL       | The name of the role |
| createdAt   | INTEGER NOT NULL    | The timestamp        |
| updatedAt   | INTEGER NOT NULL    | The timestamp        |
