from django.contrib.auth.models import User
from django.db import models

from project.models import Project
from shared.base_models import UUIDBasedBaseModel
import secrets


class APIKey(UUIDBasedBaseModel):
    """
    Client public key, which can be used in Front-End
    Which is used in remote evaluation mode
    It can only get the prompt based on request body, not the user segment
    """
    key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_private = models.BooleanField(default=False)  # pyright: ignore [reportArgumentType]

    class Meta:
        indexes = [
            models.Index(fields=['project', 'is_private']),
        ]

    def save(self, *args, **kwargs):

        if self.is_private:
            self.key = self.generate_private_api_key()
        else:
            self.key = self.generate_public_api_key()
        super().save(*args, **kwargs)

    async def asave(self, *args, **kwargs):
        if self.is_private:
            self.key = self.generate_private_api_key()
        else:
            self.key = self.generate_public_api_key()
        await super().asave(*args, **kwargs)

    @staticmethod
    def generate_public_api_key():
        # Generates a secure random string of 256 characters (128 bytes encoded in hex)
        # This is used as the API key for the client, should be very rate to collide
        return 'pub_' + secrets.token_hex(128)

    @staticmethod
    def generate_private_api_key():
        # Generates a secure random string of 256 characters
        # This is used as the API key for the client, should be very rate to collide
        return 'pri_' + secrets.token_hex(128)
