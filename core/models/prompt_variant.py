from django.db import models

from .prompt import Prompt
from .segment import Segment
from shared.base_models import UniqueNameBasedBaseModel


class PromptVariant(UniqueNameBasedBaseModel):
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='variants', to_field='unique_key')
    percentage = models.FloatField()  # todo give a max and min value
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True, to_field='unique_key')
    # when it is null, it will be random based on percentage
    selected_version_key = models.CharField(blank=True, null=True)
