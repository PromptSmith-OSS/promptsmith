from django.contrib.auth.models import User, AbstractUser  # use default User Model to represent User
from django.db import models

from shared.base_models import UUIDBasedBaseModel


class Organization(UUIDBasedBaseModel):
    """
    This is the model for the Organization
    """
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Role(models.TextChoices):
    OWNER = 'o', 'Owner'
    EDITOR = 'e', 'Editor'
    VIEWER = 'v', 'Viewer'


class UserPermissionOrganization(models.Model):
    """
    Intermediate model for User and Organization to contain the user role
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_role = models.CharField(max_length=1, choices=Role.choices, default=Role.VIEWER)

    def __str__(self):
        return self.user.username


class DeveloperAPIKey(models.Model):
    """
    This is the model for the Developer API Key
    This could be used to be authenticated as a user
    """
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    api_key_role = models.CharField(max_length=1, choices=Role.choices, default=Role.VIEWER)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
