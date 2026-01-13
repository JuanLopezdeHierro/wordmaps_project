# WordMaps Backend

Spring Boot 3 serverless application running on AWS Lambda for word graph pathfinding.

## Technology Stack

- **Java 17** (Amazon Corretto)
- **Spring Boot 3.x**
- **AWS Lambda** with SnapStart
- **Maven** for dependency management

## Local Development

### Prerequisites
- Java 17 JDK
- Maven 3.9+

### Run Locally
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Testing

Run unit tests:
```bash
mvn test
```

Run tests with coverage:
```bash
mvn test jacoco:report
```

## Build

Create deployment package:
```bash
mvn clean package -DskipTests
```

This generates `target/wordmaps-backend-0.0.1-SNAPSHOT-aws.jar` ready for Lambda deployment.

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/routes/fastest?origin={word}&destination={word}` - Find shortest path
- `GET /api/graph/stats` - Graph statistics
- `GET /api/graph/top-connected?limit={n}` - Most connected words
- `GET /api/graph/isolated` - Isolated words
- `GET /api/words/{word}/exists` - Check word existence
- `GET /api/words/{word}/neighbors` - Get neighboring words
- `GET /api/words/search?pattern={pattern}` - Search by pattern

## Project Structure

```
src/main/java/com/wordmaps/
├── WordMapsApplication.java       # Main Spring Boot application
├── config/
│   └── LambdaHandler.java        # AWS Lambda entry point
├── controller/
│   └── RouteController.java      # REST API endpoints
├── service/
│   ├── RouteFinderService.java   # Path finding logic
│   ├── GraphService.java         # Graph operations
│   └── ClusterService.java       # Graph analytics
├── strategy/
│   ├── BFSStrategy.java          # Breadth-first search
│   └── DijkstraStrategy.java     # Dijkstra algorithm
└── model/
    └── Route.java                # Response models
```

## Configuration

Lambda configuration in `template.yaml`:
- Memory: 2048 MB
- Timeout: 30 seconds
- SnapStart: Enabled
- Runtime: Java 17

## Performance Optimizations

- **SnapStart**: Reduces cold start from ~8s to ~2.5s
- **Tiered Compilation**: JVM optimization for faster startup
- **In-memory graph**: No database latency
- **BFS algorithm**: O(V+E) complexity guarantees optimal paths

## Deployment

Deployed via AWS SAM from project root. See main README for deployment instructions.
