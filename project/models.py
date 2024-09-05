from django.contrib.auth.models import Group as Organization, User
from django.db import models

from shared.base_models import UniqueNameBasedBaseModel, BaseModel


# Create your models here.


class Project(UniqueNameBasedBaseModel):
    unique_key = models.CharField(max_length=512, unique=True, editable=True)
    description = models.TextField(max_length=2048)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, to_field='username')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, to_field='name')

    def __str__(self):
        return self.unique_key

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
        ]





class ClientPublicKey(BaseModel):
    """
    Client public key
    Public Key, which can be used in Front-End
    Which is used in remote evaluation mode
    todo enable this
    """
    public_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, to_field='uuid')
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
    """
    private_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, to_field='uuid')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.unique_key + " " + self.private_key[:10]

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]
