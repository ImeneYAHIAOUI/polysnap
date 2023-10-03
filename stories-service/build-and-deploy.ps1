# Set variables
$env:PROJECT_ID = "polysnap-g"
$env:REGION = "europe-southwest1"
$env:CONNECTION_NAME = "polysnap-g:us-central1:polysnap"

$env:POSTGRESQL_ADDON_DB = "story-db"
$env:POSTGRESQL_ADDON_HOST = "/cloudsql/polysnap-g:us-central1:polysnap"
$env:POSTGRESQL_ADDON_PASSWORD = "storypassword"
$env:POSTGRESQL_ADDON_PORT = "5432"
$env:POSTGRESQL_ADDON_USER = "postgres"

# Build and submit the Docker image
gcloud builds submit `
  --tag "gcr.io/$env:PROJECT_ID/stories-service" `
  --project $env:PROJECT_ID

# Deploy to Google Cloud Run with PostgreSQL environment variables
gcloud run deploy stories-service `
  --image "gcr.io/$env:PROJECT_ID/stories-service" `
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
# Set variables
$env:PROJECT_ID = "platinum-factor-367914"
$env:REGION = "europe-southwest1"
$env:CONNECTION_NAME = "platinum-factor-367914:us-central1:polysnap"

$env:POSTGRESQL_ADDON_DB = "story-db"
$env:POSTGRESQL_ADDON_HOST = "/cloudsql/platinum-factor-367914:us-central1:polysnap"
$env:POSTGRESQL_ADDON_PASSWORD = "storypassword"
$env:POSTGRESQL_ADDON_PORT = "5432"
$env:POSTGRESQL_ADDON_USER = "postgres"

# Build and submit the Docker image
gcloud builds submit `
  --tag "gcr.io/$env:PROJECT_ID/stories-service" `
  --project $env:PROJECT_ID

# Deploy to Google Cloud Run with PostgreSQL environment variables
gcloud run deploy stories-service `
  --image "gcr.io/$env:PROJECT_ID/stories-service" `
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
