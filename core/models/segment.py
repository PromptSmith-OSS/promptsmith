from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.db import models

from shared.base_models import UniqueNameBasedBaseModel


class Segment(UniqueNameBasedBaseModel):
    """
    This is the model for the Segment
    We use ArrayField and GinIndex to better performance for Array Field lookups
    """
    distinct_ids = ArrayField(models.CharField(max_length=256), default=list, size=10000000)  # hard limit to 10 million, by default it is a new empty list

    class Meta:
        indexes = [
            models.Index(fields=['unique_key']),
            GinIndex(fields=['distinct_ids'])
        ]
