#!/bin/bash

# Run migrations, collect static files and start server
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py init_user_organization

gunicorn --env DJANGO_SETTINGS_MODULE=promptsmith.settings_production promptsmith.wsgi:application --bind 0.0.0.0:8000 --workers 2 --log-level=debug
