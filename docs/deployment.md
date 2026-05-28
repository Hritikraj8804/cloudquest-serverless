# 🚀 CloudQuest Deployment & Operations Guide

This document describes how to deploy, configure, run, and destroy the **CloudQuest Serverless Guild Portal** using Terraform and AWS.

---

## 📋 Prerequisites

Before deploying, ensure you have the following installed and configured on your machine:

1. **AWS CLI** (v2.x recommended):
   - Authenticated with an active AWS account containing sufficient administrative privileges (IAM, S3, Lambda, API Gateway, DynamoDB).
   - Configure credentials via `aws configure` (requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and a default region like `ap-south-1`).
2. **Terraform CLI** (v1.5+ recommended):
   - Installed and added to your system path.
3. **Web Browser**:
   - For testing the deployed frontend (Chrome, Firefox, Edge, etc.).

---

## ⚙️ Initial Infrastructure Provisioning

Follow these steps to deploy CloudQuest to your AWS account. All Terraform commands should be executed from the `infra/` directory.

### Step 1: Navigate to the Infra Directory
```powershell
cd infra/
```

### Step 2: Initialize Terraform
Downloads the required AWS and random providers.
```bash
terraform init
```

### Step 3: Plan the Infrastructure
Review the resources that Terraform will create in your AWS account.
```bash
terraform plan
```

### Step 4: Apply and Deploy
Deploy the resources. This will output the website URLs and API gateways on completion.
```bash
terraform apply -auto-approve
```

On a successful apply, you will see output details similar to:
```text
Outputs:

api_endpoint = "https://mncwgl50wk.execute-api.ap-south-1.amazonaws.com"
dynamodb_table_arn = "arn:aws:dynamodb:ap-south-1:989615775813:table/cloudquest-quest-requests"
dynamodb_table_name = "cloudquest-quest-requests"
lambda_arn = "arn:aws:lambda:ap-south-1:989615775813:function:cloudquest-api"
lambda_name = "cloudquest-api"
website_url = "cloudquest-frontend-643a8783.s3-website.ap-south-1.amazonaws.com"
```

---

## 📡 Dynamic Configuration & The Deployment Loop

During `terraform apply`, a local file named `frontend/config.js` is automatically generated with the API Gateway endpoint (`api_endpoint`) and uploaded to your S3 bucket.

### Updating Frontend Assets
To prevent browser caching issues and ensure changes are always deployed, the static files in S3 are tracked using MD5 hashes (`etag = filemd5(...)`). 

If you make modifications to:
- `frontend/index.html`
- `frontend/style.css`
- `frontend/app.js`
- `frontend/rpg_background.png`

Simply rerun `terraform apply` from the `infra/` folder. Terraform will detect the content change, compute a new MD5 hash, and upload only the modified files to S3 immediately.

---

## 💻 Local Development & Testing

You can run and test the RPG frontend locally while utilizing the live, serverless backend.

1. **Verify `frontend/config.js`**:
   Ensure `frontend/config.js` is populated with the correct deployed AWS API Gateway endpoint URL:
   ```javascript
   const CONFIG = {
       API_ENDPOINT: "https://<your-api-id>.execute-api.<region>.amazonaws.com"
   };
   ```
2. **Start a Local Server**:
   Serve the `frontend/` directory locally. You can use standard development utilities:
   - Python 3: `python -m http.server 8000` (run from the `frontend/` directory)
   - Node.js: `npx serve` or Live Server extension in VS Code.
3. **Open Browser**:
   Navigate to `http://localhost:8000` to interact with the game. Forms submitted here will send payloads directly to your live AWS Lambda backend.

---

## 🗑 Cleaning Up (Teardown)

To avoid incurring ongoing charges for active AWS resources, you can destroy all provisioned infrastructure.

1. Run the destroy command from the `infra/` folder:
   ```bash
   terraform destroy -auto-approve
   ```
2. Confirm that all S3 objects, DynamoDB tables, Lambda functions, and API Gateways are successfully deleted.

---

## 🛠 Troubleshooting

### 1. `filemd5()` failure during fresh `terraform apply`
*   **Symptom**: 
    ```text
    Error: Call to function "filemd5" failed: open ..\frontend\config.js: The system cannot find the file specified.
    ```
*   **Cause**: `config.js` is dynamically generated during the apply stage. If it doesn't exist yet, standard plan-time file-reading functions will crash.
*   **Resolution**: We have safely removed `filemd5()` tracking from `config.js` in `s3.tf`. It relies on standard terraform lifecycle dependencies (`depends_on = [local_file.frontend_config]`) which handles creation order automatically.

### 2. Website shows the old page content after updates
*   **Symptom**: You edited CSS/HTML/JS, ran `terraform apply`, but the website still displays the old layout.
*   **Resolution**: S3 Static Website endpoints aggressively cache assets in the browser. 
    1. Perform a **hard refresh**: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac).
    2. Check the S3 console to verify the files were updated.

### 3. Website displays CORS errors in the browser console
*   **Symptom**: Forms fail to submit, and browser console displays `Cross-Origin Request Blocked`.
*   **Resolution**: Ensure API Gateway routes are properly integrated and CORS is enabled. The `api_gateway.tf` handles HTTP CORS preflight automatically, but if a custom route is added, make sure it allows origin `*` or your specific S3 website domain.
