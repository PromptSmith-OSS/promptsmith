from typing import Optional

from ninja import ModelSchema, Schema
from pydantic import constr

from core.models import Prompt


class PromptSchema(ModelSchema):
    unique_key: constr(max_length=512, min_length=4)
    description: str
    enabled: Optional[bool] = True

    class Meta:
        model = Prompt
        fields = (
            'unique_key',
            'description',
            'enabled',
        )


PromptOutSchema = PromptSchema

PromptInSchema = PromptSchema


class PromptUpdateSchema(Schema):
    # unique_key: Optional[constr(max_length=512, min_length=4)] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None