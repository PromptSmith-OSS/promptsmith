from django.contrib.auth.models import User
from django.db import models

from project.models import Project
from shared.base_models import BaseModel


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
