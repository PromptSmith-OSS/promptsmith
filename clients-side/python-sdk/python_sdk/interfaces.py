from typing import TypedDict

from allauth.account.models import Optional
from uuid import UUID


class PromptResponse(TypedDict):
    unique_key: str
    description: str
    uuid: UUID
    name: int
    percentage: float
    content: str
    llm_model_name: Optional[str]
