from datetime import datetime
from typing import Optional
from uuid import UUID

from ninja import Schema
from pydantic import constr, field_validator

from core.models import PromptVariant
from core.schemas.prompt_version import PromptVersionOutSchema
from shared.constants import EXCLUDE_FOR_RESPONSE


class PromptVariantCreateSchema(Schema):
    name: constr(max_length=2, min_length=1)
    percentage: float
    selected_version_uuid: Optional[str] = None
    segment_uuid: Optional[UUID] = None
    llm_model_name: Optional[str] = None

    @field_validator("name")
    def validate_name(cls, v):
        """
            validate name is uppercase
        :param v:
        :return:
        """
        if not v.isupper():
            raise ValueError("name must be uppercase")
        return v


class PromptVariantOutSchema(PromptVariantCreateSchema):
    uuid: UUID
    updated_at: datetime
    created_at: datetime
    prompt_uuid: Optional[UUID] = None
    segment_uuid: Optional[UUID] = None
    versions: Optional[list[PromptVersionOutSchema]] = []

    class Meta:
        model = PromptVariant
        exclude = EXCLUDE_FOR_RESPONSE


class PromptVariantUpdateSchema(PromptVariantCreateSchema):
    name: Optional[constr(max_length=2, min_length=1)] = None
    percentage: Optional[float] = None
    segment_uuid: Optional[UUID] = None
    selected_version_uuid: Optional[str] = None
