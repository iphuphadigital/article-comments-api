# Comment REST API - Azure Functions

Refer to [Serverless docs](https://serverless.com/framework/docs/providers/azure/guide/intro/) for more information.

## Getting Started

### Setup

1. Run `cp .env.example .env` to create your own local dotenv file.
2. Run `npm install` to install all required dependencies.
3. Follow the instructions to obtain a service account's credentials file.
4. Save the file as credentials.json at the project's root folder. If you use a file name besides credentials.json, you should update the .gitignore, webpack.config.js, and dotenv file with the new name (we recommend you use credentials.json).

### Development

1. Once setup is complete, run `npm start` to run a development server.
