from typing import Literal

from django.contrib.auth.models import User, AbstractUser  # use default User Model to represent User
from django.db import models
from django.db.models import QuerySet

from shared.base_models import UUIDBasedBaseModel


class Organization(UUIDBasedBaseModel):
    """
    This is the model for the Organization
    """
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=512, blank=True)
    address = models.TextField(max_length=256, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(
        User,
        through='UserPermissionOrganization',
        related_name='organizations',
    )

    def __str__(self):
        return self.name

    async def add_user(self, user, role: Literal['o', 'e', 'v']):
        """
        Add user to the organization
        :param user: User
        :param role: str
        :return:
        """
        UserPermissionOrganization.objects.create(user=user, organization=self, user_role=role)

    async def remove_user(self, user):
        """
        Remove user from the organization
        :param user: User
        :return:
        """
        UserPermissionOrganization.objects.filter(user=user, organization=self).delete()

    async def get_users_by_role(self, role: Literal['o', 'e', 'v']):
        """
        Get users by role
        :param role: str
        :return:
        """
        return UserPermissionOrganization.objects.filter(organization=self, user_role=role)

    async def check_user_is_owner(self, user):
        """
        Check if the user is owner of the organization
        :param user: User
        :return:
        """
        return UserPermissionOrganization.objects.filter(user=user, organization=self, user_role='o').exists()

    async def check_user_is_editor(self, user):
        """
        Check if the user can edit the organization
        in another word, eitor or owner
        :param user: User
        :return:
        """
        return UserPermissionOrganization.objects.filter(user=user, organization=self,
                                                         user_role__in=['o', 'e']).exists()

    async def check_user_is_viewer(self, user):
        """
        Check if the user can view the organization
        in another word, viewer, editor or owner
        :param user: User
        :return:
        """
        return UserPermissionOrganization.objects.filter(user=user, organization=self).exists()


    @classmethod
    def user_viewable_organizations(cls, user) -> QuerySet:
        """
        Get the organizations that the user can view
        :param user: User
        :return:
        """
        return Organization.objects.filter(
            userpermissionorganization__user=user,
            userpermissionorganization__user_role__in=['o', 'e', 'v']
        )





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

    class Meta:
        unique_together = ['user', 'organization']


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
