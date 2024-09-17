from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from user_organization.models import Organization, UserPermissionOrganization, Role

from dotenv import load_dotenv
import os
from django.db import transaction
from django.db.models import Q

load_dotenv()

User = get_user_model()  # Get the user model (custom or default)

ORG_NAME = 'Default Organization'


class Command(BaseCommand):
    help = 'Initialize the user with the organization'

    def handle(self, *args, **kwargs):
        # Get values from environment variables
        email = os.environ.get('USER_EMAIL', 'admin@localhost.lan')
        username = email
        password = os.environ.get('USER_PASSWORD', 'AwesomePromptsManagement')
        if not email or not password:
            self.stdout.write(self.style.ERROR('Required environment variables are missing'))
            return

        org_name = ORG_NAME
        org_description = '{} created by user ({})'.format(org_name, email)

        try:
            # Use transaction.atomic() to wrap the operations in a single transaction
            with transaction.atomic():
                is_user_table_empty = User.objects.count() == 0
                is_org_table_empty = Organization.objects.count() == 0

                if not is_user_table_empty or not is_org_table_empty:
                    raise ValueError(
                        'User or Organization table is not empty, you have already initialized the user and organization')

                # Create user
                existing_user = User.objects.filter(Q(email=email) | Q(username=username)).exists()
                if existing_user:
                    raise ValueError(f"User {email} already exists")
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'User {username} created successfully!'))

                # Create organisation
                if Organization.objects.filter(name=org_name).exists():
                    raise ValueError(f"Organization {org_name} already exists")
                organization = Organization.objects.create(name=org_name,
                                                           description=org_description)
                organization.save()
                self.stdout.write(self.style.SUCCESS(f'Organization {org_name} created successfully!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred: {e}"))
            # At this point, any database changes made within the `atomic()` block are rolled back.
