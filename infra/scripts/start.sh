#!/bin/bash

# Run migrations, collect static files and start server
export DJANGO_SETTINGS_MODULE=PromptSmith.settings_production
python manage.py makemigrations --noinput
python manage.py migrate --noinput
#poetry run python manage.py runserver
gunicorn --env PromptSmith.wsgi:application --bind 0.0.0.0:8000 --workers 2 --log-level=info