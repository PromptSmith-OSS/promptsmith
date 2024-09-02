from django.db import models

from shared.base_models import UniqueNameBasedBaseModel


class Prompt(UniqueNameBasedBaseModel):
    unique_key = models.CharField(max_length=512, unique=True, editable=True)
    description = models.TextField(max_length=2048)
    enabled = models.BooleanField(default=True)

    # project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, to_field='uuid')

    def __str__(self):
        return self.text

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
            models.Index(fields=['enabled'])
        ]
