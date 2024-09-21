import os

from django.db import transaction

from project.models import Project
from user_organization.models import Organization, UserPermissionOrganization
from .init_user_organization import ORG_NAME, User, PROJECT_DEFAULT_KEY, Command as InitCommand, load_dotenv

load_dotenv()


class Command(InitCommand):
    help = 'Reset the user with the organization'

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
                # try find the user with email
                user = User.objects.filter(email=email).first()
                # try find organisation
                organization = Organization.objects.filter(name=org_name).first()

                if user and organization:
                    # find the user permission organization
                    user_permission_organization = UserPermissionOrganization.objects.filter(user=user,
                                                                                             organization=organization).first()

                    if user_permission_organization:
                        user_permission_organization.delete() if user_permission_organization else None
                        self.stdout.write(self.style.SUCCESS(
                            f'UserPermissionOrganization {user_permission_organization} deleted successfully!'))

                    # find the project
                    project = Project.objects.filter(organization=organization, unique_key=PROJECT_DEFAULT_KEY,
                                                     created_by=user).first()
                    project.delete() if project else None
                    self.stdout.write(self.style.SUCCESS(f'Project {project} deleted successfully!'))

                    # delete user and organization
                    user.delete() if user else None
                    organization.delete() if organization else None
                    self.stdout.write(
                        self.style.SUCCESS(f'User {user} and Organization {organization} deleted successfully!'))

                # recreate
                super().handle(*args, **kwargs)




        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred: {e}"))
            # At this point, any database changes made within the `atomic()` block are rolled back.
