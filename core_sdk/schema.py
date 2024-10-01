from decimal import Decimal
from typing import Optional
from uuid import UUID

from ninja import Schema


class SDKPromptSchema(Schema):
    unique_key: str
    description: Optional[str] = None
    name: Optional[str] = None

    # from variant
    llm_model_name: Optional[str] = None
    percentage: Optional[float] = None

    # from version
    uuid: UUID
    content: str
