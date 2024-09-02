from typing import Optional

from ninja import ModelSchema

from core.models import PromptVariant


class PromptVariantInSchema(ModelSchema):
    unique_key: str
    percentage: float
    segment_unique_key: Optional[str]
    selected_version_key: Optional[str]

    class Meta:
        model = PromptVariant
        exclude = ('id',)


class PromptVariantOutSchema(PromptVariantInSchema):
    uuid: str
