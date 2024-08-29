from django.db import models

from .prompt import Prompt
from .segment import Segment
from shared.base_models import UniqueNameBasedBaseModel


class PromptVariant(UniqueNameBasedBaseModel):
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    percentage = models.FloatField()  # todo give a max and min value
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True)
    # when it is null, it will be random based on percentage
    selected_version_uuid = models.UUIDField(blank=True, null=True)
