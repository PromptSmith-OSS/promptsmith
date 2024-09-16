from typing import List

from django.shortcuts import aget_object_or_404, aget_list_or_404
from ninja import Router

from core.models.prompt_variant import PromptVariant
from core.models.prompt import Prompt
from core.schemas.prompt_variant import PromptVariantCreateSchema, PromptVariantOutSchema, PromptVariantUpdateSchema
from shared.utils import convert_query_set_to_list
from uuid import UUID
from django.db import models

prompt_variant_router = Router(
    tags=['Prompt Variant'],
)


@prompt_variant_router.post('/{prompt_uuid}/variant/', response=PromptVariantOutSchema)
async def create_prompt_variant(request, prompt_uuid: UUID, variant: PromptVariantCreateSchema):
    """
    Create a new prompt variant
    """
    if variant.segment_uuid:
        segment = await aget_object_or_404(Segment, uuid=variant.segment_uuid)
        variant.segment = segment
    del variant.segment_uuid

    the_prompt = await aget_object_or_404(Prompt, uuid=prompt_uuid)
    new_variant = await PromptVariant.objects.acreate(prompt=the_prompt, **variant.dict())
    new_variant.prompt_uuid = the_prompt.uuid
    return new_variant


@prompt_variant_router.get('/{prompt_uuid}/variant/', response=List[PromptVariantOutSchema])
async def get_all_prompt_variants(request, prompt_uuid: UUID):
    """
    Get all variants for a prompt
    """
    # django queryset cannot be used to return as List[PrompVariantOutSchema] directly
    qs = PromptVariant.objects.filter(prompt__uuid=prompt_uuid).all().select_related('prompt', 'segment').annotate(
        prompt_uuid=models.F('prompt__uuid'),
        segment_uuid=models.F('segment__uuid'),
    )
    return await aget_list_or_404(qs)


@prompt_variant_router.get('/{prompt_uuid}/variant/{uuid}', response=PromptVariantOutSchema)
async def get_prompt_variant(request, prompt_uuid: UUID, uuid: UUID):
    """
    Get the prompt variant by uuid
    """
    qs = PromptVariant.objects.filter(prompt__uuid=prompt_uuid, uuid=uuid).select_related('prompt', 'segment').annotate(
        prompt_uuid=models.F('prompt__uuid'),
        segment_uuid=models.F('segment__uuid'),
    )
    return await aget_object_or_404(qs)


@prompt_variant_router.put('/{prompt_uuid}/variant/{uuid}', response=PromptVariantOutSchema)
async def update_prompt_variant(request, prompt_uuid: UUID, uuid: UUID, variant: PromptVariantUpdateSchema):
    """
    Update an existing prompt variant
    """
    qs = PromptVariant.objects.filter(prompt__uuid=prompt_uuid, uuid=uuid).select_related('prompt', 'segment').annotate(
        prompt_uuid=models.F('prompt__uuid'),
        segment_uuid=models.F('segment__uuid'),
    )
    obj = await aget_object_or_404(qs)
    for k, v in variant.dict().items():
        if v is not None and k != "uuid":
            setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_variant_router.delete('/{prompt_uuid}/variant/{uuid}')
async def delete_prompt_variant(request, prompt_uuid: UUID, uuid: UUID):
    """
    Delete a prompt variant
    """
    obj = await aget_object_or_404(PromptVariant, prompt__uuid=prompt_uuid, uuid=uuid)
    await obj.adelete()
    return {'success': True}
