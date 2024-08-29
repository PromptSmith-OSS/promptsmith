from ninja import ModelSchema

from core.models import Prompt


class PromptSchema(ModelSchema):
    class Meta:
        model = Prompt
        fields = (
            'unique_key',
            'description',
            'enabled',
        )
