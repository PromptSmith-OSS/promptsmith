from django.db import models
from django.contrib.auth.models import User, \
    Group as Organization  # use default User and Group Model to represent User and Organization
# todo use extended User and Group model to represent User and Organization


# Create your models here.

class Role(models.TextChoices):
    OWNER = 'o', 'Owner'
    EDITOR = 'e', 'Editor'
    VIEWER = 'v', 'Viewer'


class UserPermissionGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    permission = models.CharField(max_length=1, choices=Role.choices, default=Role.VIEWER)

    def __str__(self):
        return self.user.username

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['organization']),
        ]


class DeveloperAPIKey(models.Model):
    """
    This is the model for the DeveloperAPIKey
    to be defined
    """
    pass
