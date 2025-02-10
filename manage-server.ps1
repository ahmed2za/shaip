# Set working directory to script location
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Define ports
$clientPort = 3000
$serverPort = 5000

Write-Host "Working directory: $scriptPath"
Write-Host "Checking and managing ports..."

# Function to stop processes on a specific port
function Stop-ProcessOnPort {
    param (
        [int]$Port
    )
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                Select-Object -ExpandProperty OwningProcess | 
                Sort-Object -Unique
    
    foreach ($process in $processes) {
        try {
            $processInfo = Get-Process -Id $process -ErrorAction SilentlyContinue
            if ($processInfo) {
                Write-Host "Stopping process $($processInfo.ProcessName) (PID: $process) on port $Port"
                taskkill /F /PID $process 2>$null
                Start-Sleep -Seconds 1
            }
        }
        catch {
            Write-Host "Could not stop process with PID $process"
        }
    }
}

# Kill any existing node processes
Write-Host "Stopping all Node.js processes..."
taskkill /F /IM "node.exe" 2>$null
Start-Sleep -Seconds 2

# Stop any processes on required ports
Stop-ProcessOnPort -Port $clientPort
Stop-ProcessOnPort -Port $serverPort

# Stop current PM2 processes
Write-Host "Stopping PM2 services..."
pm2 delete all

# Clean client
Write-Host "Cleaning client..."
$clientPath = Join-Path $scriptPath "client"
if (Test-Path $clientPath) {
    Set-Location $clientPath
    
    # Clean cache and node_modules
    if (Test-Path ".next") {
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Install client dependencies and build
    Write-Host "Installing client dependencies..."
    npm install --force
    
    Write-Host "Building client..."
    npm run build
} else {
    Write-Host "Client directory not found at: $clientPath"
    exit 1
}

# Return to root
Set-Location $scriptPath

# Clean server
Write-Host "Cleaning server..."
$serverPath = Join-Path $scriptPath "server"
if (Test-Path $serverPath) {
    Set-Location $serverPath
    
    # Clean node_modules
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Install server dependencies
    Write-Host "Installing server dependencies..."
    npm install --force
} else {
    Write-Host "Server directory not found at: $serverPath"
    exit 1
}

# Return to root
Set-Location $scriptPath

# Start server using PM2
Write-Host "Starting server..."
pm2 start ecosystem.config.js

Write-Host "Server started successfully!"
Write-Host "You can access the application at:"
Write-Host "Client: http://localhost:$clientPort"
Write-Host "Server: http://localhost:$serverPort"
