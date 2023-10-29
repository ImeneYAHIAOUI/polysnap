
# Cloud Environment Setup Guide
## Prerequisites

1. **Create a Google Cloud Platform (GCP) account** :  If you don't have an account yet, sign up for [Google Cloud Platform](https://cloud.google.com/?hl=fr).
2. **Create a Clever Cloud account** : If you don't have an account yet, sign up for [Clever Cloud](https://www.clever-cloud.com).  
3. **Install Google Cloud Command Line Tool (gcloud)**: Follow the installation instructions for your operating system [here](https://cloud.google.com/sdk/docs/install?hl=fr).
4. **Authentication**: Log in to your Google Cloud account via the command line using the `gcloud auth login` command.

## Create a Google Cloud Project
1. **Create a new project**: Create a new project by running the following command in the command line: `gcloud projects create [PROJECT_ID] --name=[PROJECT_NAME]`. Replace `[PROJECT_ID]` with your project ID and `[PROJECT_NAME]` with your project name.
2. **Set the project ID**: Set the project ID by running the following command in the command line: `gcloud config set project [PROJECT_ID]`. Replace `[PROJECT_ID]` with your project ID.

## Create Google Cloud instances

### App Engine
Create an App Engine instance by specifying the region: `gcloud app create --region=[REGION]`. Replace `[REGION]` with your region.

### Cloud SQL

Create a Cloud SQL instance with a specific zone:

```bash
gcloud sql instances create [INSTANCE_NAME] \
    --database-version=POSTGRES_13 \
    --cpu=[CPU] \
    --memory=[MEMORY] \
    --region=[REGION] \
    --zone=[ZONE] \
    --root-password=[PASSWORD]
```
Replace `[INSTANCE_NAME]` with your instance name, `[CPU]` with the number of CPUs, `[MEMORY]` with the memory size, `[REGION]` with the region and `[ZONE]` with the zone. `[PASSWORD]` is the password for the root user.

### Cloud Storage

Create a Cloud Strage bucket with a specific region:

```bash
gsutil mb -l [REGION] gs://[BUCKET_NAME]
```

Replace `[REGION]` with your region and `[BUCKET_NAME]` with your bucket name.

### Pub/Sub

Create a Pub/Sub topic with a specific region:

```bash
  gcloud pubsub topics create [TOPIC_NAME] --message-storage-policy-allowed-regions=[REGION]
```

Replace `[TOPIC_NAME]` with your topic name and `[REGION]` with your region.

### API Gateway

Create an API Gateway instance with a specific region:

```bash
gcloud endpoints services deploy gateway/openapi2-appengine.yaml --project=[PROJECT_ID]
```

Replace `[PROJECT_ID]` with your project ID.

## Set Configuration Variables