# ESL Website Backend

Project for the ESL Website Backend. This project is built using Cloudflare Workers, and is written in TypeScript.

## Getting Started

### Pre-requisites

**Git** and **Node.js** are required to be installed on your machine. It is recommended to use [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions.

> **Note:** This project uses Node.js v19.8.1. If you are using NVM, you can run `nvm install` in the project directory to install the correct version of Node.js.

### Installation

1. Clone the repository from GitHub by running `git clone https://github.com/chatchatabc/esl-backend-workers` in your terminal or command prompt.
2. Open the project directory by running `cd esl-backend-workers` in your terminal or command prompt.
3. If you are using **NVM**, run `nvm use` to use the correct version of Node.js.
4. Run `npm install` to install the dependencies.
5. Run `npm run d1:local` to generate the local database.

### Running the Project

1. Run `npm run dev` to start the development server.

### Deployment

1. Run `npm run deploy` to deploy the project to Cloudflare Workers.

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/): A serverless platform for deploying applications globally
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript
- [tRPC](https://trpc.io/): A TypeScript RPC framework for building end-to-end type-safe APIs
- [Valibot](https://valibot.dev/): A schema validation library for typesafe runtime validation of JSON objects
- [CryptoJS](https://cryptojs.gitbook.io/docs/): A JavaScript library of crypto standards
- [Cron Parser](https://github.com/harrisiirak/cron-parser): A JavaScript library for parsing cron expressions

## Database

The database used for this project is the Cloudflare D1 database. It is the best database solution that could provide the best performance for the cloudflare workers CPU time limit.

### Configuration

1. If you want to change or add a new table, you can edit the entities or the database schema through this file [schema.sql](./schema.sql)
2. Run `npm run d1:local` to execute the `schema.sql` file and generate the local database.
   > **Note:** The data in the local database will be deleted and replaced with the new data.

### Online deployment

1. Run `npm run d1:remote` to execute the `schema.sql` file and generate the remote database.
   > **Note:** The data in the remote database will be deleted and replaced with the new data.

### Online database backup

D1 has built-in support for creating and restoring backups of the databases. If you wish to know more about this, you can visit [this link](https://developers.cloudflare.com/d1/learning/backups/) to learn more.

## Project Structure

```
./
├── src/
│   ├── application/
│   │   └── trpc/
│   │       └── ...
│   ├── domain/
│   │   ├── infra/
│   │   │   └── ...
│   │   ├── models/
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   └── ...
│   │   ├── schemas/
│   │   │   └── ...
│   │   └── services/
│   │       └── ...
│   ├── tests/
│   │   └── ...
│   └── index.ts
├── dump_file.sql
├── schema.sql
├── wrangler.toml
└── ...
```

### Definitions

- **Application**: The application layer is the layer that is responsible for handling the requests and responses of the application.
  - **Application/Trpc**: The trpc layer is the layer that is responsible for handling the requests and responses of the application using the tRPC framework.
- **Domain**: The domain layer is the layer that is responsible for the business logic of the application.
  - **Domain/Infra**: The infra layer is the layer that is responsible for the infrastructure of the application.
  - **Domain/Models**: The models layer is the layer that is responsible for the models of the application.
  - **Domain/Repositories**: The repositories layer is the layer that is responsible for the repositories of the application.
  - **Domain/Schemas**: The schemas layer is the layer that is responsible for the type-safe schemas of the application.
  - **Domain/Services**: The services layer is the layer that is responsible for the services of the application.
- **Tests**: The tests layer is the layer that is responsible for the tests of the application.
- **index.ts**: The index.ts file is the entry point of the application.
- **dump_file.sql**: The dump_file.sql file is the file that contains the data of the database.
- **schema.sql**: The schema.sql file is the file that contains the schema of the database.
- **wrangler.toml**: The wrangler.toml file is the file that contains the configuration of the Cloudflare Workers.
