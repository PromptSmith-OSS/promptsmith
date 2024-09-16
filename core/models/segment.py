from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.db import models

from shared.base_models import UUIDBasedBaseModel
from project.models import Project


class Segment(UUIDBasedBaseModel):
    """
    This is the model for the Segment
    We use ArrayField and GinIndex to better performance for Array Field lookups
    """
    name = models.CharField(max_length=256)
    distinct_ids = ArrayField(models.CharField(max_length=256), default=list,
                              size=10000000)  # hard limit to 10 million, by default it is a new empty list, in API we should have a lower soft limit

    # project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            # models.Index(fields=['project__uuid']),
            GinIndex(fields=['distinct_ids']),
        ]
