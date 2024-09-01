from typing import List

from django.db.models import F
from django.shortcuts import aget_object_or_404
from ninja import Router

from core.models.prompt_variant import PromptVariant
from core.schemas.prompt_variant import PromptVariantOutSchema, PromptVariantInSchema

from shared.utils import convert_query_set_to_list

prompt_variant_router = Router(
    tags=['Prompt Variant'],
)


@prompt_variant_router.get('/{prompt_unique_key}/variant/', response=List[PromptVariantOutSchema])
async def get_all_prompt_variants(request, prompt_unique_key: str):
    """
    Get all variants for a prompt
    """
    # django queryset cannot be used to return as List[PrompVariantOutSchema] directly
    qs = PromptVariant.objects.filter(prompt__unique_key=prompt_unique_key).values('percentage',
                                                                                   'segment__unique_key',
                                                                                   'selected_version_key', )
    return await convert_query_set_to_list(qs)


@prompt_variant_router.get('/{prompt_unique_key}/variant/{unique_key}', response=PromptVariantOutSchema)
async def get_prompt_variant(request, prompt_unique_key: str, unique_key: str):
    """
    Get the prompt variant by uuid
    """
    return await aget_object_or_404(PromptVariant, prompt__unique_key=prompt_unique_key, unique_key=unique_key)


@prompt_variant_router.post('/{prompt_unique_key}/variant/', response=PromptVariantOutSchema)
async def create_prompt_variant(request, prompt_unique_key: str, variant: PromptVariantInSchema):
    """
    Create a new prompt variant
    """
    return await PromptVariant.objects.acreate(prompt__unique_key=prompt_unique_key, **variant.dict())


@prompt_variant_router.put('/{prompt_unique_key}/variant/{unique_key}', response=PromptVariantOutSchema)
async def update_prompt_variant(request, prompt_unique_key: str, unique_key: str, variant: PromptVariantInSchema):
    """
    Update an existing prompt variant
    """
    obj = await aget_object_or_404(PromptVariant, prompt__unique_key=prompt_unique_key, unique_key=unique_key)
    for k, v in variant.dict().items():
        setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_variant_router.delete('/{prompt_unique_key}/variant/{unique_key}')
async def delete_prompt_variant(request, prompt_unique_key: str, unique_key: str):
    """
    Delete a prompt variant
    """
    obj = await aget_object_or_404(PromptVariant, prompt__unique_key=prompt_unique_key, unique_key=unique_key)
    await obj.adelete()
    return {'success': True}
