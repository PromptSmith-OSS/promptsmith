from datetime import datetime
from typing import Optional
from uuid import UUID

from ninja import ModelSchema
from pydantic import constr

from core.models import PromptVersion
from shared.constants import EXCLUDE_FOR_CREATE, EXCLUDE_FOR_RESPONSE


class PromptVersionCreateSchema(ModelSchema):
    name: constr(max_length=128, min_length=4)
    content: constr(max_length=100000, min_length=1) # limit to 100k characters

    class Meta:
        model = PromptVersion
        exclude = EXCLUDE_FOR_CREATE + ('variant',)


class PromptVersionOutSchema(PromptVersionCreateSchema):
    uuid: UUID
    updated_at: datetime
    created_at: datetime
    variant_uuid: Optional[UUID] = None

    class Meta:
        model = PromptVersion
        exclude = EXCLUDE_FOR_RESPONSE


class PromptVersionUpdateSchema(PromptVersionCreateSchema):
    name: Optional[constr(max_length=128, min_length=4)] = None
    content: Optional[constr(max_length=100000, min_length=1)] = None
