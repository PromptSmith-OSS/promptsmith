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


@prompt_variant_router.get('/{prompt__uuid}/variant/', response=List[PromptVariantOutSchema])
async def get_all_prompt_variants(request, prompt__uuid: str):
    """
    Get all variants for a prompt
    """
    # django queryset cannot be used to return as List[PrompVariantOutSchema] directly
    qs = PromptVariant.objects.filter(prompt__uuid=prompt__uuid).values('percentage',
                                                                        'segment__uuid',
                                                                        'selected_version_key', )
    return await convert_query_set_to_list(qs)


@prompt_variant_router.get('/{prompt__uuid}/variant/{uuid}', response=PromptVariantOutSchema)
async def get_prompt_variant_by_key(request, prompt__uuid: str, uuid: str):
    """
    Get the prompt variant by uuid
    """
    return await aget_object_or_404(PromptVariant, prompt__uuid=prompt__uuid, uuid=uuid)


@prompt_variant_router.get('/{prompt__uuid}/variant/key{uuid}', response=PromptVariantOutSchema)
async def get_prompt_variant_by_key(request, prompt__uuid: str, uuid: str):
    """
    Get the prompt variant by uuid
    """
    return await aget_object_or_404(PromptVariant, prompt__uuid=prompt__uuid, uuid=uuid)


@prompt_variant_router.post('/{prompt__uuid}/variant/', response=PromptVariantOutSchema)
async def create_prompt_variant(request, prompt__uuid: str, variant: PromptVariantOutSchema):
    """
    Create a new prompt variant
    """
    return await PromptVariant.objects.acreate(prompt__uuid=prompt__uuid, **variant.dict())


@prompt_variant_router.put('/{prompt__uuid}/variant/{uuid}', response=PromptVariantOutSchema)
async def update_prompt_variant(request, prompt__uuid: str, uuid: str, variant: PromptVariantInSchema):
    """
    Update an existing prompt variant
    """
    obj = await aget_object_or_404(PromptVariant, prompt__uuid=prompt__uuid, uuid=uuid)
    for k, v in variant.dict().items():
        setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_variant_router.delete('/{prompt__uuid}/variant/{uuid}')
async def delete_prompt_variant(request, prompt__uuid: str, uuid: str):
    """
    Delete a prompt variant
    """
    obj = await aget_object_or_404(PromptVariant, prompt__uuid=prompt__uuid, uuid=uuid)
    await obj.adelete()
    return {'success': True}
