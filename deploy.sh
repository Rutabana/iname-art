#!/bin/bash

# Deploy script for iname-art (Next.js application)
# Deploys to art-center.loic-rutabana.com

set -e

PROJECT_DIR="/home/ubuntu/iname-art"
APP_NAME="iname-art"
PORT=3001
SERVICE_NAME="iname-art"
DOMAIN="art-center.loic-rutabana.com"

echo "🚀 Starting deployment of $APP_NAME..."

# Navigate to project directory
cd "$PROJECT_DIR"

# Pull latest changes
echo "📦 Pulling latest code..."
git pull origin main || git pull origin master || echo "No remote branch found or already up to date"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Create systemd service file
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << SERVICEEOF
[Unit]
Description=$APP_NAME Next.js Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$PROJECT_DIR
Environment="NODE_ENV=production"
Environment="PORT=$PORT"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=append:/var/log/$SERVICE_NAME.log
StandardError=append:/var/log/$SERVICE_NAME.log

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Reload systemd daemon
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Start or restart the service
echo "▶️  Starting service..."
sudo systemctl restart $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

# Wait a moment for service to start
sleep 2

# Check service status
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo "✅ Service is running!"
    sudo systemctl status $SERVICE_NAME --no-pager
else
    echo "❌ Service failed to start. Check logs:"
    sudo tail -20 /var/log/$SERVICE_NAME.log
    exit 1
fi

echo ""
echo "✨ Deployment complete!"
echo "🌐 Application available at: https://$DOMAIN"
echo "📊 Logs: sudo journalctl -u $SERVICE_NAME -f"
echo "🔍 Service status: sudo systemctl status $SERVICE_NAME"
