from typing import List

from django.db.models import F
from django.shortcuts import aget_object_or_404
from ninja import Router

from core.models.prompt_variant import PromptVariant
from core.schemas.prompt_variant import PromptVariantOutSchema

prompt_variant_router = Router(
    tags=['Prompt Variant'],
)


@prompt_variant_router.get('/{prompt_key}/variant/', response=List[PromptVariantOutSchema])
async def get_all_prompt_variants(request, prompt_key: str):
    """
    Get all variants for a prompt
    """
    return [
        variant
        async for variant in
        # find all the prompt variants that have the same prompt key and convert segment key to segment unique key
        PromptVariant.objects.filter(prompt__unique_key=prompt_key).values('percentage',
                                                                           'segment__unique_key',
                                                                           'selected_version_key', )
    ]


@prompt_variant_router.get('/{prompt_key}/variant/{unique_key}', response=PromptVariantOutSchema)
async def get_prompt_variant(request, prompt_key: str, unique_key: str):
    """
    Get the prompt variant by uuid
    """
    return await aget_object_or_404(PromptVariant, prompt__unique_key=prompt_key, unique_key=unique_key)
