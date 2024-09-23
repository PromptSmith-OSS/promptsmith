from datetime import datetime
from typing import Optional
from uuid import UUID

from ninja import ModelSchema
from pydantic import constr

from project.models import Project
from shared.constants import EXCLUDE_FOR_RESPONSE


class ProjectOutSchema(ModelSchema):
    unique_key: constr(max_length=256, min_length=4)
    description: str
    created_at: datetime
    updated_at: datetime
    uuid: UUID
    organization_uuid: Optional[UUID] = None
    created_by_username: Optional[str] = None

    class Meta:
        model = Project
        exclude = EXCLUDE_FOR_RESPONSE + ('metadata', 'organization', 'created_by')
