#!/bin/bash

echo "Deploying application..."

# Pull code mới
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Cache lại
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage bootstrap/cache public/uploads
chmod -R 775 public/build

echo "Application deployed!" 