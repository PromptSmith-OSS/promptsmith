from datetime import datetime
from typing import Optional

from ninja import ModelSchema, Schema
from pydantic import constr

from core.models import Prompt

from uuid import UUID

from shared.constants import EXCLUDE_FOR_CREATE, EXCLUDE_FOR_UPDATE, EXCLUDE_FOR_RESPONSE


class PromptCreateSchema(Schema):
    unique_key: constr(max_length=256, min_length=4)
    description: str
    project_uuid: UUID
    enabled: Optional[bool] = True

    class Meta:
        exclude = EXCLUDE_FOR_CREATE


class PromptOutSchema(PromptCreateSchema):
    uuid: UUID
    updated_at: datetime
    created_at: datetime

    class Meta:
        exclude = EXCLUDE_FOR_RESPONSE + ('project',)


class PromptUpdateSchema(PromptCreateSchema):
    unique_key: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    project_uuid: Optional[UUID] = None
