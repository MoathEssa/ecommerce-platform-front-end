// ──────────────────────────────────────────────────────────────────────────────
// ECommerceCenterFr – Azure Static Web App Infrastructure (Bicep)
// Deploy: az deployment group create -g <rg> -f infra/main.bicep -p infra/main.bicepparam
// ──────────────────────────────────────────────────────────────────────────────

@description('Base name used to derive all resource names')
param appName string

@description('Azure region for all resources')
param location string = 'eastus2'

@description('SKU for the Static Web App – Free is great for portfolio demos')
@allowed(['Free', 'Standard'])
param skuName string = 'Free'

// ── Azure Static Web App ────────────────────────────────────────────────────

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: '${appName}-frontend'
  location: location
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
  }
}

// ── Outputs ─────────────────────────────────────────────────────────────────

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'

@secure()
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
