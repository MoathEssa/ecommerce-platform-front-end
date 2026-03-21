// Parameters file for main.bicep – safe to commit (no secrets here).
using 'main.bicep'

param appName = 'ecommercecenter' // Must match your backend's appName for consistency
param skuName = 'Free'            // Free tier – change to Standard for custom domains, auth, etc.
