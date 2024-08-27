from django.db import models
from shared.base_models import BaseModel, SoftDeleteBaseModel
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex


# Create your models here.
class Prompt(BaseModel):
    key = models.CharField(max_length=512, unique=True)
    description = models.TextField(max_length=2048)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.text

    class Meta:
        indexes = [
            models.Index(fields=['key']),
            models.Index(fields=['enabled'])
        ]


class Segment(BaseModel):
    """
    This is the model for the Segment
    We use ArrayField and GinIndex to better performance for Array Field lookups
    """
    key = models.CharField(max_length=256, unique=True)
    distinct_ids = ArrayField(models.CharField(max_length=256), default=list, size=10000000)  # hard limit to 10 million

    class Meta:
        indexes = [
            models.Index(fields=['key']),
            GinIndex(fields=['distinct_ids'])
        ]


class PromptVariant(BaseModel):
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    percentage = models.FloatField()  # todo give a max and min value
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True)
    # when it is null, it will be random based on percentage
    selected_version_uuid = models.UUIDField(blank=True, null=True)


class PromptVersion(SoftDeleteBaseModel):
    key = models.CharField(max_length=512, unique=True)
    prompt_variant = models.ForeignKey(PromptVariant, on_delete=models.CASCADE)
    # created by
    # updated by
    model_name = models.TextField(max_length=128)  # better to provide a list of model names
    content = models.TextField(max_length=1000000)  # hard limit to 1 million characters

    def __str__(self):
        return self.key + " - " + self.content[:50]

    class Meta:
        indexes = [
            models.Index(fields=['key']),
            models.Index(fields=['model_name'])
        ]
