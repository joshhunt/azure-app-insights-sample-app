# Azure Application Insights sample app

Small node.js web server instrumented with Azure Application insights, and a script to generate traffic

## Usage

Set up environment variables:

- `PORT`
- `APPINSIGHTS_INSTRUMENTATIONKEY`
- `GITHUB_ACCESS_TOKEN`: requires no special permissions, only read only to public repos

```
yarn install
pm2 restart ecosystem.config.js
```
