from django.contrib.auth.models import User
from django.db import models

from project.models import Project
from shared.base_models import UUIDBasedBaseModel
import secrets


class ClientPublicKey(UUIDBasedBaseModel):
    """
    Client public key, which can be used in Front-End
    Which is used in remote evaluation mode
    It can only get the prompt based on request body, not the user segment
    """
    public_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]

    def save(self, *args, **kwargs):
        self.project_key = self.generate_api_key()
        super().save(*args, **kwargs)

    async def asave(self, *args, **kwargs):
        self.project_key = self.generate_api_key()
        await super().asave(*args, **kwargs)

    @staticmethod
    def generate_api_key():
        # Generates a secure random string of 512 characters (256 bytes encoded in hex)
        # This is used as the API key for the client, should be very rate to collide
        return secrets.token_hex(256)


class ServerPrivateKey(UUIDBasedBaseModel):
    """
    Server private key
    Private Key, which should be kept secret
    Which is used in local evaluation mode
    todo - It can get the prompts and the user segment, to calculate the right prompt locally
    """
    private_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]
