from typing import Optional

from ninja import ModelSchema, Schema
from pydantic import constr

from core.models import Prompt


class PromptInSchema(ModelSchema):
    unique_key: constr(max_length=512, min_length=4)
    description: str
    enabled: Optional[bool] = True

    class Meta:
        model = Prompt
        exclude = ('id',)

class PromptOutSchema(PromptInSchema):
    uuid: str