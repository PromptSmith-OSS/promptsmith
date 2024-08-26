from django.db import models
from shared.base_models import BaseModel, SoftDeleteBaseModel
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Prompt(BaseModel):
    key = models.CharField(max_length=512)
    description = models.TextField(max_length=2048)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.text


class Segment(BaseModel):
    key = models.CharField(max_length=256)
    distinct_ids = ArrayField(models.CharField(max_length=256), default=list)



class PromptVarient(BaseModel):
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    percentage = models.FloatField() # todo give a max and min value
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True)
    selected_version_uuid = models.UUIDField(blank=True, null=True)


class PromptVersion(SoftDeleteBaseModel):
    key = models.CharField(max_length=512)
    prompt_varient = models.ForeignKey(PromptVarient, on_delete=models.CASCADE)
    # created by
    # updated by
    model_name = models.TextField(max_length=128) # better to provide a list of model names
    content = models.TextField(max_length=1000000)

    def __str__(self):
        return self.text
