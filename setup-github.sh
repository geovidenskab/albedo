#!/bin/bash

# Setup script for GitHub repository
echo "🚀 Setting up Albedo Calculator for GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Albedo Calculator web application

- Interactive albedo calculation from satellite images
- Real-time visualization on canvas
- Data export to CSV/Excel
- Local storage for measurements
- Educational tool for geography and climate studies"

# Add remote origin (if not already added)
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/geovidenskab/albedo.git
fi

# Set main branch
echo "🌿 Setting up main branch..."
git branch -M main

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push -u origin main"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Your app will be available at: https://geovidenskab.github.io/albedo/"
echo ""
echo "To run locally:"
echo "python3 -m http.server 8000"
echo "Then open: http://localhost:8000"
