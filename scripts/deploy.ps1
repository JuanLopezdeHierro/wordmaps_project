# Deploy Script for WordMaps
Write-Host "Starting WordMaps Deployment..." -ForegroundColor Cyan

# Ensure SAM is in PATH
$env:Path += ";C:\Program Files\Amazon\AWSSAMCLI\bin"

# 2. Build Backend (Spring Boot -> Lambda)
Write-Host "Building Backend..."
cd wordmaps-backend
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }
cd ..

# 3. Build Frontend (React -> S3 Assets)
Write-Host "Building Frontend..."
cd wordmaps-frontend
npm install
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }
cd ..

# 4. AWS SAM Build & Deploy
Write-Host "Deploying Infrastructure with SAM..."
sam build
sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

# 5. Sync Frontend to S3 (Post-Deploy)
Write-Host "IMPORTANT: After deployment, run manually: aws s3 sync ./wordmaps-frontend/dist s3://YOUR-BUCKET-NAME" -ForegroundColor Yellow
