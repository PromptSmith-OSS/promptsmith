from django.contrib.auth.models import Group as Organization, User
from django.db import models

from shared.base_models import UniqueNameBasedBaseModel, BaseModel


# Create your models here.


class Project(UniqueNameBasedBaseModel):
    description = models.TextField(max_length=2048)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.unique_key

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
        ]


class ClientPublicKey(BaseModel):
    public_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.unique_key

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]


class ServerPrivateKey(BaseModel):
    private_key = models.CharField(max_length=2048, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.project.unique_key

    class Meta:
        indexes = [
            models.Index(fields=['project']),
        ]
