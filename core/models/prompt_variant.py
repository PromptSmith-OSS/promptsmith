from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from shared.base_models import UniqueNameBasedBaseModel
from shared.validators import validate_uppercase_letters
from .prompt import Prompt
from .segment import Segment


class PromptVariant(UniqueNameBasedBaseModel):
    name = models.CharField(max_length=2, editable=True, default='A', validators=[
        validate_uppercase_letters
    ])
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='variants', to_field='uuid')
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100,
        validators=[
            MinValueValidator(0),  # Minimum value allowed
            MaxValueValidator(100)  # Maximum value allowed
        ])
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, blank=True, null=True, to_field='uuid')
    # when it is null, it will be random based on percentage
    selected_version_uuid = models.UUIDField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['prompt', ]),
        ]
        constraints = [
            models.UniqueConstraint(fields=['prompt', 'name'], name='unique_prompt_variant_key')
        ]

    def __str__(self):
        return self.name

    def selected_version(self):
        """
        Get the selected version
        :return:
        """
        return self.versions.get(uuid=self.selected_version_uuid)

    async def get_selected_version(self):
        """
        Get the selected version asynchronously
        :return:
        """
        return await self.versions.aget(uuid=self.selected_version_uuid)
