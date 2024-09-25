from core.models.prompt_variant import PromptVariant
from django.db import models

from shared.base_models import SoftDeleteUUIDBaseModel
from .prompt import Prompt
from simple_history.models import HistoricalRecords


class PromptVersion(SoftDeleteUUIDBaseModel):
    name = models.TextField(max_length=128)
    variant = models.ForeignKey(PromptVariant, on_delete=models.CASCADE, related_name='versions')
    # created by
    # updated by
    content = models.TextField(max_length=1000000)  # hard limit to 1 million characters
    history = HistoricalRecords(
        excluded_fields=['uuid', 'deleted_at', 'created_at', 'updated_at', 'variant']
    ) # no hard limit, but a soft limit is required

    def __str__(self):
        return self.unique_key + " - " + self.content[:50]

    class Meta:
        indexes = []
        constraints = [
            models.UniqueConstraint(fields=['variant', 'name'], name='unique_variant_version_name')
        ]
