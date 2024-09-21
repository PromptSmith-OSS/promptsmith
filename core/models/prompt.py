from django.db import models

from shared.base_models import UUIDBasedBaseModel
from project.models import Project


class Prompt(UUIDBasedBaseModel):
    unique_key = models.CharField(max_length=256, unique=True, editable=True)
    description = models.TextField(max_length=1024)
    enabled = models.BooleanField(default=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.text

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
        ]
