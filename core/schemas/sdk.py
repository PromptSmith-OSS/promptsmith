from typing import List, Optional
from ninja import Schema

from .prompt_variant import PromptVariantOutSchema
from .prompt_version import PromptVersionOutSchema

from uuid import UUID


class PromptSchema(Schema):
    uuid: UUID
    prompt_key: str
    prompt_description: Optional[str] = None
    name: str

    # from variant
    llm_model_name: Optional[str] = None

    # from version
    content: str

