# Set variables
$env:PROJECT_ID = "platinum-factor-367914"
$env:REGION = "europe-southwest1"
$env:CONNECTION_NAME = "platinum-factor-367914:us-central1:story-db"

$env:POSTGRESQL_ADDON_DB = "bbo5kfyhzvsmduxrawr9"
$env:POSTGRESQL_ADDON_HOST = "bbo5kfyhzvsmduxrawr9-postgresql.services.clever-cloud.com"
$env:POSTGRESQL_ADDON_PASSWORD = "SkWJLymRn40DwryfoZvbO2rXxhNNew"
$env:POSTGRESQL_ADDON_PORT = "5432"
$env:POSTGRESQL_ADDON_URI = "postgresql://utl06gakq5vgivmez5yl:SkWJLymRn40DwryfoZvbO2rXxhNNew@bbo5kfyhzvsmduxrawr9-postgresql.services.clever-cloud.com:5432/bbo5kfyhzvsmduxrawr9"
$env:POSTGRESQL_ADDON_USER = "utl06gakq5vgivmez5yl"
$env:POSTGRESQL_ADDON_VERSION = "11"

# Build and submit the Docker image
gcloud builds submit `
  --tag "gcr.io/$env:PROJECT_ID/users-service" `
  --project $env:PROJECT_ID

# Deploy to Google Cloud Run with PostgreSQL environment variables
gcloud run deploy users-service `
  --image "gcr.io/$env:PROJECT_ID/users-service" `
  --platform managed `
  --region $env:REGION `
  --allow-unauthenticated `
  --add-cloudsql-instances $env:CONNECTION_NAME `
  --set-env-vars "POSTGRESQL_ADDON_DB=$env:POSTGRESQL_ADDON_DB" `
  --set-env-vars  "POSTGRESQL_ADDON_HOST=$env:POSTGRESQL_ADDON_HOST" `
  --set-env-vars  "POSTGRESQL_ADDON_PASSWORD=$env:POSTGRESQL_ADDON_PASSWORD" `
  --set-env-vars  "POSTGRESQL_ADDON_PORT=$env:POSTGRESQL_ADDON_PORT" `
  --set-env-vars  "POSTGRESQL_ADDON_URI=$env:POSTGRESQL_ADDON_URI" `
  --set-env-vars  "POSTGRESQL_ADDON_USER=$env:POSTGRESQL_ADDON_USER" `
  --set-env-vars  "POSTGRESQL_ADDON_VERSION=$env:POSTGRESQL_ADDON_VERSION" `
  --project $env:PROJECT_ID
