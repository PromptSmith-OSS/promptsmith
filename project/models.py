from typing import Literal

from django.core.cache import cache
from django.db import models
from ninja.errors import AuthenticationError

from shared.base_models import UUIDBasedBaseModel, BaseModel
from user_organization.models import Organization, User


# Create your models here.


class Project(UUIDBasedBaseModel):
    unique_key = models.CharField(max_length=256, unique=True, editable=True)
    description = models.TextField(max_length=2048)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)

    """
    # Potentially granular permissions
    metadata = {
      owners: [user1, user2],
      editors: [user3, user4],
      viewers: [user5, user6],
    }
    """
    metadata = models.JSONField(default=dict)  # metadata for the project

    def __str__(self):
        return self.unique_key

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
        ]

    async def add_user(self, user, role: Literal['owners', 'editors', 'viewers']):
        """
        Add user to the project
        :param user: User
        :param role: str
        :return:
        """
        if role not in self.metadata:
            self.metadata[role] = []
        self.metadata[role].append(user)
        await self.asave()

    async def remove_user(self, user, role: Literal['owners', 'editors', 'viewers']):
        """
        Remove user from the project
        :param user: User
        :param role: str
        :return:
        """
        if role in self.metadata:
            self.metadata[role].remove(user)
            await self.asave()

    async def add_owner(self, user):
        """
        Add owner to the project
        :param user: User
        :return:
        """
        await self.add_user(user, 'owners')

    async def has_view_permission_for_user(self, user):
        """
        Check if user has view permission
        :param user: User
        :return: bool
        """
        return user in self.metadata.get('viewers', []) or await self.has_edit_permission_for_user(user)

    async def has_edit_permission_for_user(self, user):
        """
        Check if user has edit permission
        :param user: User
        :return: bool
        """
        return user in self.metadata.get('editors', []) or await self.has_owner_permission_for_user(user)

    async def has_owner_permission_for_user(self, user):
        """
        Check if user has owner permission
        :param user: User
        :return: bool
        """
        return user in self.metadata.get('owners', [])

    async def is_viewable_to_user_organization(self, user):
        cache_key = f"cache_{self.is_viewable_to_user_organization.__name__}_{self.uuid}_{user}"
        ttl = 60
        result = await cache.aget(cache_key)
        if result is not None:
            return result

        user_organizations = Organization.user_viewable_organizations(user).values_list(
            'id', flat=True
        ).all()

        user_has_permission = await Project.objects.filter(uuid=self.uuid,
                                                           organization__in=user_organizations
                                                           ).aexists()
        if not user_has_permission:
            await cache.aset(cache_key, user_has_permission, ttl)
            raise AuthenticationError('User does not have permission to access this project')

        await cache.aset(cache_key, user_has_permission, ttl)
        return True


class ClientPublicKey(BaseModel):
    """
    Client public key, which can be used in Front-End
    Which is used in remote evaluation mode
    It can only get the prompt based on request body, not the user segment
    """
    public_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.unique_key + " " + self.public_key[:10]

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]


class ServerPrivateKey(BaseModel):
    """
    Server private key
    Private Key, which should be kept secret
    Which is used in local evaluation mode
    todo - It can get the prompts and the user segment, to calculate the right prompt locally
    """
    private_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.unique_key + " " + self.private_key[:10]

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]
