from datetime import datetime
from typing import Optional

from ninja import ModelSchema, Schema

from core.models import Prompt, PromptVersion

from shared.constants import EXCLUDE_FOR_CREATE, EXCLUDE_FOR_RESPONSE, EXCLUDE_FOR_UPDATE
from pydantic import constr, validator, field_validator
from uuid import UUID


class PromptVersionCreateSchema(ModelSchema):
    name: constr(max_length=128, min_length=4)
    content: constr(max_length=100000, min_length=1) # limit to 100k characters

    class Meta:
        model = PromptVersion
        exclude = EXCLUDE_FOR_CREATE + ('prompt',)


class PromptVersionOutSchema(PromptVersionCreateSchema):
    uuid: UUID
    updated_at: datetime
    created_at: datetime
    prompt_uuid: UUID

    class Meta:
        model = PromptVersion
        exclude = EXCLUDE_FOR_RESPONSE


class PromptVersionUpdateSchema(PromptVersionCreateSchema):
    name: Optional[constr(max_length=128, min_length=4)] = None
    content: Optional[constr(max_length=100000, min_length=1)] = None
