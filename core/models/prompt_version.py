from django.db import models

from .prompt_variant import PromptVariant
from shared.base_models import SoftDeleteBaseModel


class PromptVersion(SoftDeleteBaseModel):
    prompt_variant = models.ForeignKey(PromptVariant, on_delete=models.CASCADE)
    # created by
    # updated by
    model_name = models.TextField(max_length=128)  # better to provide a list of model names
    content = models.TextField(max_length=1000000)  # hard limit to 1 million characters

    def __str__(self):
        return self.unique_key + " - " + self.content[:50]

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
            models.Index(fields=['model_name'])
        ]
