# Set variables
$env:PROJECT_ID = "platinum-factor-367914"
$env:REGION = "europe-southwest1"
$env:CONNECTION_NAME = "platinum-factor-367914:us-central1:story-db"

# Build and submit the Docker image
gcloud builds submit `
  --tag "gcr.io/$env:PROJECT_ID/stories-service" `
  --project $env:PROJECT_ID

# Deploy to Google Cloud Run
gcloud run deploy stories-service `
  --image "gcr.io/$env:PROJECT_ID/stories-service" `
  --platform managed `
  --region $env:REGION `
  --allow-unauthenticated `
  --add-cloudsql-instances $env:CONNECTION_NAME `
  --project $env:PROJECT_ID
