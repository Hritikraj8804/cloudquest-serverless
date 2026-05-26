# ⚔ CloudQuest Guild Portal

CloudQuest is a serverless fantasy-themed quest management platform built on AWS.

Users can submit quests through a web interface, which are processed by AWS Lambda and stored in DynamoDB through API Gateway.

---

## 🚀 Architecture

```text
User
  ↓
S3 Static Website
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB
```

---

## ✨ Features

- Fantasy-themed Guild Portal UI
- Quest submission workflow
- Serverless backend
- Automatic Quest ID generation
- Reward calculation
- Guild Rank assignment
- DynamoDB persistence
- Infrastructure as Code with Terraform
- API Gateway integration

---

## 🛠 AWS Services Used

| Service | Purpose |
|----------|----------|
| AWS Lambda | Serverless business logic |
| API Gateway | HTTP API endpoint |
| DynamoDB | NoSQL data storage |
| IAM | Secure permissions |
| S3 | Static website hosting |
| CloudWatch | Logging and monitoring |

---

## 📂 Project Structure

```text
cloudquest-serverless/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── infra/
│   ├── provider.tf
│   ├── versions.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── dynamodb.tf
│   ├── iam.tf
│   ├── lambda.tf
│   ├── api_gateway.tf
│   └── s3.tf
│
├── lambda/
│   └── handler.py
│
└── README.md
```

---

## ⚙️ Infrastructure Provisioning

Initialize Terraform:

```bash
terraform init
```

Validate:

```bash
terraform validate
```

Plan:

```bash
terraform plan
```

Deploy:

```bash
terraform apply
```

---

## 📡 API Example

### Request

```json
{
  "heroName": "Hritik",
  "heroClass": "Warrior",
  "questType": "Dragon Hunt",
  "dangerLevel": "Extreme",
  "description": "Ancient dragon attacking villages"
}
```

### Response

```json
{
  "questId": "QST-D7F05FE3",
  "reward": 500,
  "guildRank": "Legendary",
  "status": "PENDING"
}
```

---

## 🗄 DynamoDB Record

```json
{
  "questId": "QST-D7F05FE3",
  "heroName": "Hritik",
  "heroClass": "Warrior",
  "questType": "Dragon Hunt",
  "dangerLevel": "Extreme",
  "reward": 500,
  "guildRank": "Legendary",
  "status": "PENDING"
}
```

---

## 🔒 Security

- IAM least-privilege permissions
- Lambda execution role
- API Gateway to Lambda permissions
- Terraform-managed infrastructure

---

## 📈 Future Improvements

- CloudFront CDN
- Custom domain
- GitHub Actions CI/CD
- Terraform Remote State
- CloudWatch Dashboard
- Authentication with Cognito
- Quest Management Dashboard

---

## 👨‍💻 Author

Hritik Raj

Built as part of a DevOps and Cloud Engineering project portfolio using AWS and Terraform.