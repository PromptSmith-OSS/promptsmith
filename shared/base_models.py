from uuid import uuid4

from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDBasedBaseModel(BaseModel):
    uuid = models.UUIDField(editable=False, default=uuid4, )  # uneditabe uuid, exposed to the outside world

    # unique_key = models.CharField(max_length=512, unique=True,
    #                               editable=True)  # we don't want to use this for external FK reference, because it can be changed

    class Meta:
        abstract = True


class SoftDeleteUUIDBaseModel(UUIDBasedBaseModel):
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    def hard_delete(self):
        super().delete(*args, **kwargs)

    class Meta:
        abstract = True
