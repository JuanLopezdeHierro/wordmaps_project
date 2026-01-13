#!/usr/bin/env pwsh
# Full deployment script for WordMaps project
# Builds backend, deploys SAM, builds frontend, syncs to S3, and invalidates CloudFront

param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WordMaps Full Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add Maven to PATH if needed
$env:Path += ";$env:USERPROFILE\apache-maven-3.9.6\bin"

# Backend Build and Deploy
if (-not $SkipBackend) {
    Write-Host "[1/6] Building Backend..." -ForegroundColor Yellow
    Push-Location wordmaps-backend
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) { 
        Pop-Location
        throw "Backend build failed" 
    }
    Pop-Location
    Write-Host "✓ Backend built successfully" -ForegroundColor Green
    Write-Host ""

    Write-Host "[2/6] Building SAM..." -ForegroundColor Yellow
    sam build
    if ($LASTEXITCODE -ne 0) { throw "SAM build failed" }
    Write-Host "✓ SAM build successful" -ForegroundColor Green
    Write-Host ""

    Write-Host "[3/6] Deploying to AWS..." -ForegroundColor Yellow
    sam deploy
    if ($LASTEXITCODE -ne 0) { throw "SAM deploy failed" }
    Write-Host "✓ Backend deployed successfully" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[SKIPPED] Backend build and deploy" -ForegroundColor Gray
    Write-Host ""
}

# Frontend Build and Deploy
if (-not $SkipFrontend) {
    Write-Host "[4/6] Building Frontend..." -ForegroundColor Yellow
    Push-Location wordmaps-frontend
    npm install
    npm run build
    if ($LASTEXITCODE -ne 0) { 
        Pop-Location
        throw "Frontend build failed" 
    }
    Pop-Location
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
    Write-Host ""

    Write-Host "[5/6] Syncing to S3..." -ForegroundColor Yellow
    $bucket = aws cloudformation describe-stack-resources `
        --stack-name wordmaps `
        --query "StackResources[?ResourceType=='AWS::S3::Bucket'].PhysicalResourceId" `
        --output text 2>&1 | Out-String
    
    if ($LASTEXITCODE -ne 0) { throw "Failed to get S3 bucket name" }
    $bucket = $bucket.Trim()
    
    Write-Host "  Bucket: $bucket" -ForegroundColor Gray
    aws s3 sync ./wordmaps-frontend/dist s3://$bucket --delete
    if ($LASTEXITCODE -ne 0) { throw "S3 sync failed" }
    Write-Host "✓ Frontend synced to S3" -ForegroundColor Green
    Write-Host ""

    Write-Host "[6/6] Invalidating CloudFront..." -ForegroundColor Yellow
    $distId = aws cloudformation describe-stack-resources `
        --stack-name wordmaps `
        --query "StackResources[?ResourceType=='AWS::CloudFront::Distribution'].PhysicalResourceId" `
        --output text 2>&1 | Out-String
    
    if ($LASTEXITCODE -ne 0) { throw "Failed to get CloudFront distribution ID" }
    $distId = $distId.Trim()
    
    Write-Host "  Distribution: $distId" -ForegroundColor Gray
    aws cloudfront create-invalidation `
        --distribution-id $distId `
        --paths "/*" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "CloudFront invalidation failed" }
    Write-Host "✓ CloudFront cache invalidated" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[SKIPPED] Frontend build and deploy" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  Frontend: https://d2euump6bzpha5.cloudfront.net" -ForegroundColor Cyan
Write-Host "  API: https://e23y9088lc.execute-api.us-east-1.amazonaws.com/api" -ForegroundColor Cyan
Write-Host ""
