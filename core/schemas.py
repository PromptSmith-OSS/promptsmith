from ninja import ModelSchema
from .models import Prompt


class PromptSchema(ModelSchema):
    class Meta:
        model = Prompt
        fields = (
            'unique_key',
            'description',
            'enabled',
        )