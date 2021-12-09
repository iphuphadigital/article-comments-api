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

## Deployment

### Local

To deploy your Azure Functions locally, you will need to ensure that you have the following:

- [Azure Account](https://www.serverless.com/framework/docs/providers/azure/guide/credentials)

Deployment is simple and requires you to run the following command with your specific credentials.

```
serverless deploy --resourceGroup {your-resource-group} --subscriptionId {your-subscription-id} --storageNameSuffix {your-storage-name-suffix}
```

This command will deploy to South Africa North region by default. You can add a `--region {your-region}` flag to change the default region or update it in the serverless.yml file.

### GitHub Actions

To deploy your Azure Functions through GitHub Actions (DevOps), you will need to ensure that you have the following:

- [Azure Account](https://www.serverless.com/framework/docs/providers/azure/guide/credentials)
- Azure [service principal](https://www.serverless.com/framework/docs/providers/azure/guide/credentials#authenticating-with-a-service-principal) credentials stored as secrets on your GitHub repository.

Deployment is automatically triggered on every new commit push to the main branch.
