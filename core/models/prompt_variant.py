from django.db import models

from .prompt import Prompt
from .segment import Segment
from shared.base_models import UniqueNameBasedBaseModel


class PromptVariant(UniqueNameBasedBaseModel):
    unique_key = models.CharField(max_length=512, unique=True, editable=True)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='variants', to_field='uuid')
    percentage = models.FloatField()  # todo give a max and min value
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True, to_field='uuid')
    # when it is null, it will be random based on percentage
    selected_version_key = models.CharField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['prompt']),
        ]

    def __str__(self):
        return self.unique_key

    def selected_version(self):
        return self.versions.get(unique_key=self.selected_version_key)

    async def get_selected_version(self):
        return await self.versions.aget(unique_key=self.selected_version_key)
