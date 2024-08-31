from typing import Optional

from ninja import ModelSchema, Schema
from pydantic import constr

from core.models import PromptVariant

from pydantic import Field



class PromptVariantSchema(ModelSchema):
    percentage: float
    segment_unique_key: Optional[str]
    selected_version_key: Optional[str]

    class Meta:
        model = PromptVariant
        exclude = ('id',)



PromptVariantOutSchema = PromptVariantSchema
PromptVariantInSchema = PromptVariantSchema
