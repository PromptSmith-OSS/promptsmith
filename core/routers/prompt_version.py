from typing import List
from uuid import UUID

from django.db import models
from django.shortcuts import aget_object_or_404, aget_list_or_404
from ninja import Router
from ninja.errors import ValidationError

from core.models.prompt import Prompt
from core.models.prompt_version import PromptVersion
from core.schemas.prompt_version import PromptVersionCreateSchema, PromptVersionOutSchema, PromptVersionUpdateSchema

version_router = Router(
    tags=['Prompt Version'],
)


@version_router.post('/{prompt_uuid}/version', response=PromptVersionOutSchema)
async def create_version(request, prompt_uuid: UUID, version: PromptVersionCreateSchema):
    """
    Create a new version
    """
    the_prompt = await aget_object_or_404(Prompt, uuid=prompt_uuid)

    # check if the name is unique
    if await PromptVersion.objects.filter(prompt=the_prompt, name=version.name).aexists():
        raise ValidationError([{'type': 'duplication', 'name': version.name, 'msg': f'Same name has already existed.'}])
    obj = await PromptVersion.objects.acreate(prompt=the_prompt, **version.dict())
    obj.prompt_uuid = the_prompt.uuid
    return obj


@version_router.get('/{prompt_uuid}/version', response=List[PromptVersionOutSchema])
async def get_all_versions(request, prompt_uuid: UUID):
    """
    Get all versions for a prompt
    """
    qs = PromptVersion.objects.filter(prompt__uuid=prompt_uuid).all().select_related('prompt').annotate(
        prompt_uuid=models.F('prompt__uuid'),
    )
    return await aget_list_or_404(qs)


@version_router.get('/{prompt_uuid}/version/{uuid}', response=PromptVersionOutSchema)
async def get_version(request, prompt_uuid: UUID, uuid: UUID):
    """
    Get the version by uuid
    """
    qs = PromptVersion.objects.filter(prompt__uuid=prompt_uuid, uuid=uuid).select_related('prompt').annotate(
        prompt_uuid=models.F('prompt__uuid'),
    )
    return await aget_object_or_404(qs)


@version_router.put('/{prompt_uuid}/version/{uuid}', response=PromptVersionOutSchema)
async def update_version(request, prompt_uuid: UUID, uuid: UUID, version: PromptVersionUpdateSchema):
    """
    Update an existing version
    """
    qs = PromptVersion.objects.filter(prompt__uuid=prompt_uuid, uuid=uuid).select_related('prompt').annotate(
        prompt_uuid=models.F('prompt__uuid'),
    )
    obj = await aget_object_or_404(qs)
    for k, v in version.dict().items():
        if v is not None and k != "uuid":
            setattr(obj, k, v)
    await obj.asave()
    return obj


@version_router.delete('/{prompt_uuid}/version/{uuid}')
async def delete_version(request, prompt_uuid: UUID, uuid: UUID):
    """
    Delete a version
    """
    obj = await aget_object_or_404(PromptVersion, prompt__uuid=prompt_uuid, uuid=uuid)
    await obj.adelete()
    return {'success': True}
