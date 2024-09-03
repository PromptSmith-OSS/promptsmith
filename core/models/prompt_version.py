from django.db import models

from shared.base_models import SoftDeleteBaseModel
from .prompt import Prompt


class PromptVersion(SoftDeleteBaseModel):
    name = models.TextField(max_length=128)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='versions',
                               to_field='uuid')
    # created by
    # updated by
    model_name = models.TextField(max_length=128)  # better to provide a list of model names
    content = models.TextField(max_length=1000000)  # hard limit to 1 million characters

    def __str__(self):
        return self.unique_key + " - " + self.content[:50]

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['model_name']),
            models.Index(fields=['prompt']),
        ]
