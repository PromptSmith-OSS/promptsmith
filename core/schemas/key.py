from datetime import datetime

from allauth.account.utils import Optional
from ninja import ModelSchema
from pydantic import constr

from project.schemas.project import ProjectOutSchema
from core.models import APIKey


class APIKeyOutSchema(ModelSchema):
    key: constr(max_length=4096)
    project: ProjectOutSchema
    created_at: datetime
    is_private: bool

    class Meta:
        model = APIKey
        exclude = ['id', 'created_by']


class APIKeyInSchema(ModelSchema):
    is_private: Optional[bool] = False

    class Meta:
        model = APIKey
        exclude = ['id', 'project', 'created_by', 'key', 'created_at', 'updated_at']
