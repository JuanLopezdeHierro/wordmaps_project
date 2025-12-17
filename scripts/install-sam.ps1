# PowerShell script to download and install AWS SAM CLI
$installerUrl = "https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi"
$installerPath = "$env:TEMP\AWS_SAM_CLI_64_PY3.msi"

Write-Host "Downloading AWS SAM CLI from $installerUrl..."
Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath

Write-Host "Installing AWS SAM CLI..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $installerPath /quiet /norestart" -Wait

Write-Host "Installation Complete."
