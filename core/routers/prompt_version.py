from functools import wraps
from typing import List
from uuid import UUID

from django.db import models
from django.shortcuts import aget_object_or_404, aget_list_or_404
from ninja import Router
from ninja.errors import ValidationError

from core.models.prompt_variant import PromptVariant
from core.models.prompt_version import PromptVersion
from core.schemas.prompt_version import PromptVersionCreateSchema, PromptVersionOutSchema, PromptVersionUpdateSchema


def check_variant_exists(func):
    """
    A decorator to check if the variant exists and belongs to the project/user
    :param func:
    :return:
    """

    @wraps(func)
    async def wrapper(request, prompt_uuid: UUID, variant_uuid: UUID, *args, **kwargs):
        project = request.auth
        variant_qs = PromptVariant.objects.filter(uuid=variant_uuid, prompt__uuid=prompt_uuid, prompt__project=project)

        the_variant = await aget_object_or_404(variant_qs, uuid=variant_uuid)
        if not the_variant:
            raise ValidationError([{'type': 'not_found', 'msg': f'Variant with the uuid was not found.'}])

        return await func(request, prompt_uuid, variant_uuid, *args, **kwargs)

    return wrapper


version_router = Router(
    tags=['Prompt Version'],
)


@version_router.post('/{prompt_uuid}/{variant_uuid}/version', response=PromptVersionOutSchema)
@check_variant_exists
async def create_version(request, prompt_uuid: UUID, variant_uuid: UUID, version: PromptVersionCreateSchema):
    """
    Create a new version
    """
    # check if the name is unique
    if await PromptVersion.objects.filter(variant__uuid=variant_uuid, name=version.name).aexists():
        raise ValidationError([{'type': 'duplication', 'name': version.name, 'msg': f'Same name has already existed.'}])
    obj = await PromptVersion.objects.acreate(variant__uuid=variant_uuid, **version.dict())
    obj.variant_uuid = variant_uuid
    return obj


@version_router.get('/{prompt_uuid}/{variant_uuid}/version', response=List[PromptVersionOutSchema])
@check_variant_exists
async def get_all_versions(request, prompt_uuid: UUID, variant_uuid: UUID):
    """
    Get all versions for a prompt
    """
    qs = PromptVersion.objects.filter(variant__uuid=variant_uuid).all().select_related('variant').annotate(
        variant_uuid=models.F('variant__uuid'),
    )
    return await aget_list_or_404(qs)


@version_router.get('/{prompt_uuid}/{variant_uuid}/version/{uuid}', response=PromptVersionOutSchema)
@check_variant_exists
async def get_version(request, prompt_uuid: UUID, variant_uuid: UUID, uuid: UUID):
    """
    Get the version by uuid
    """
    qs = PromptVersion.objects.filter(variant_uuid=variant_uuid, uuid=uuid).select_related('variant').annotate(
        variant_uuid=models.F('variant__uuid'),
    )
    return await aget_object_or_404(qs)


@version_router.put('/{prompt_uuid}/{variant_uuid}/version/{uuid}', response=PromptVersionOutSchema)
@check_variant_exists
async def update_version(request, prompt_uuid: UUID, variant_uuid: UUID, uuid: UUID,
                         version: PromptVersionUpdateSchema):
    """
    Update an existing version
    """
    qs = PromptVersion.objects.filter(variant__uuid=variant_uuid, uuid=uuid)
    obj = await aget_object_or_404(qs)
    for k, v in version.dict().items():
        if v is not None and k != "uuid":
            setattr(obj, k, v)
    await obj.asave()
    return obj


@version_router.delete('/{prompt_uuid}/{variant_uuid}/version/{uuid}')
@check_variant_exists
async def delete_version(request, prompt_uuid: UUID, variant_uuid: UUID, uuid: UUID):
    """
    Delete a version
    """
    obj = await aget_object_or_404(PromptVersion, variant_uuid=variant_uuid, uuid=uuid)
    await obj.adelete()
    return {'success': True}
