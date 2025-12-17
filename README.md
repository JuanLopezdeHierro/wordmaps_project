# WordMaps

A serverless web application for exploring a graph of 3-letter English words, finding optimal paths between words that differ by a single letter.

## Overview

WordMaps implements a graph-based word transformation system where each node represents a valid 3-letter English word, and edges connect words that differ by exactly one character. The application uses breadth-first search to find the shortest path between any two words.

**Live Demo:** https://d2euump6bzpha5.cloudfront.net

## Architecture

### Technology Stack

**Frontend**
- React 18 with Vite
- TailwindCSS for styling
- Axios for API communication
- Hosted on AWS S3 + CloudFront

**Backend**
- Spring Boot 3 with Java 17
- AWS Lambda with SnapStart enabled
- API Gateway HTTP API v2
- Deployed via AWS SAM

**Infrastructure**
- AWS Lambda (compute)
- API Gateway (routing)
- S3 (static hosting)
- CloudFront (CDN)
- Infrastructure as Code with SAM/CloudFormation

### System Design

```
User → CloudFront → S3 (React App)
              ↓
        API Gateway → Lambda (Spring Boot)
```

The frontend serves a single-page React application through CloudFront's global CDN. API requests are routed through API Gateway to a Lambda function running the Spring Boot backend, which processes requests and returns JSON responses.

## Features

### Word Path Finding
Find the shortest transformation path between two words using BFS algorithm.

**Example:** CAT → FAT requires 1 step (change C to F)

### Graph Analytics
- View overall graph statistics (nodes, edges, connectivity)
- Identify most connected words
- Find isolated words with no connections

### Word Exploration
- Check if a word exists in the graph
- Get neighboring words (one letter different)
- Search words by pattern

## API Endpoints

Base URL: `https://e23y9088lc.execute-api.us-east-1.amazonaws.com/api`

### Routes
```
GET /routes/fastest?origin={word}&destination={word}
```
Find shortest path between two words.

**Response:**
```json
{
  "origin": "CAT",
  "destination": "FAT",
  "path": ["CAT", "FAT"],
  "steps": 1,
  "routeType": "FASTEST",
  "difficulty": "EASY",
  "transformations": [
    {
      "from": "CAT",
      "to": "FAT",
      "stepNumber": 1,
      "description": "Change 'C' -> 'F' at position 1"
    }
  ]
}
```

### Graph Statistics
```
GET /graph/stats
GET /graph/top-connected?limit=10
GET /graph/isolated
```

### Word Operations
```
GET /words/{word}/exists
GET /words/{word}/neighbors
GET /words/search?pattern={pattern}
```

## Local Development

### Prerequisites
- Java 17 JDK
- Apache Maven 3.9+
- Node.js 18+
- AWS CLI configured
- AWS SAM CLI

### Backend Setup

```bash
cd wordmaps-backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
cd wordmaps-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Deployment

### Deploy Backend

```bash
# Build with Maven
cd wordmaps-backend
mvn clean package -DskipTests

# Build and deploy with SAM
cd ..
sam build
sam deploy
```

### Deploy Frontend

```bash
# Build production bundle
cd wordmaps-frontend
npm run build

# Sync to S3
aws s3 sync ./dist s3://[YOUR-BUCKET-NAME] --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id [YOUR-DISTRIBUTION-ID] \
  --paths "/*"
```

## Configuration

### Lambda Settings
- **Runtime:** Java 17
- **Memory:** 2048 MB
- **Timeout:** 30 seconds
- **SnapStart:** Enabled
- **Environment:** `JAVA_TOOL_OPTIONS=-XX:+TieredCompilation -XX:TieredStopAtLevel=1`

### API Gateway
- **Type:** HTTP API (v2)
- **CORS:** Enabled for all origins
- **PayloadFormatVersion:** 2.0 (critical for Spring Boot Lambda handler compatibility)

## Performance

- **Cold Start:** ~2-4 seconds (with SnapStart)
- **Warm Start:** <500ms
- **Average Response Time:** 100-500ms

## Project Structure

```
wordmaps_project/
├── template.yaml              # SAM/CloudFormation template
├── samconfig.toml            # SAM deployment configuration
├── wordmaps-backend/
│   ├── pom.xml
│   └── src/main/java/com/wordmaps/
│       ├── WordMapsApplication.java
│       ├── config/
│       │   └── LambdaHandler.java
│       ├── controller/
│       │   └── RouteController.java
│       ├── service/
│       │   ├── RouteFinderService.java
│       │   ├── GraphService.java
│       │   └── ClusterService.java
│       └── model/
│           └── Route.java
└── wordmaps-frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── services/api.js
        └── components/
```

## Troubleshooting

### 502 Bad Gateway
Ensure `PayloadFormatVersion` in `template.yaml` is set to "2.0" to match the HttpApiV2ProxyHandler.

### CloudFront Serving Stale Content
Invalidate the CloudFront distribution cache after deploying frontend changes.

### Lambda Timeout
Increase memory allocation or enable SnapStart to reduce cold start times.

## License

This project is available for educational purposes.

## Technical Notes

The graph is constructed in-memory using an adjacency list representation. The BFS implementation guarantees finding the shortest path with O(V + E) complexity, where V is the number of words and E is the number of valid single-letter transformations.

AWS SnapStart significantly reduces cold start latency by pre-initializing the Lambda execution environment and caching the initialized state.
