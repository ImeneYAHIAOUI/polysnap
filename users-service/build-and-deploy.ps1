# Import the credentials script
. .\credentials.ps1

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
  --set-env-vars  "POSTGRESQL_ADDON_USER=$env:POSTGRESQL_ADDON_USER" `
  --project $env:PROJECT_ID

