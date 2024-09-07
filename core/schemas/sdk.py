
from typing import List, Optional
from ninja import Schema

from .prompt_variant import PromptVariantOutSchema
from .prompt_version import PromptVersionOutSchema



class PromptSchema(Schema):
    unique_key: str
    variants: Optional[List[PromptVariantOutSchema]] = None
    versions: Optional[List[PromptVersionOutSchema]] = None
    context: str