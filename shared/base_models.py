from django.db import models
from django.core.validators import MinLengthValidator


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UniqueNameBasedBaseModel(BaseModel):
    unique_key = models.CharField(max_length=512, unique=True)

    class Meta:
        abstract = True


class SoftDeleteBaseModel(UniqueNameBasedBaseModel):
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
