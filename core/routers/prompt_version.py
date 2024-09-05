from ninja import Router
from typing import List

from core.models.prompt_version import PromptVersion
from core.schemas.prompt_version import PromptVersionCreateSchema, PromptVersionOutSchema, PromptVersionUpdateSchema
from shared.utils import convert_query_set_to_list
from uuid import UUID

version_router = Router(
    tags=['Prompt Version'],
)


@version_router.post('/{prompt_uuid}/version', response=PromptVersionOutSchema)
async def create_version(request, prompt_uuid: UUID, version: PromptVersionCreateSchema):
    """
    Create a new version
    """
    return await PromptVersion.objects.acreate(prompt__uuid=prompt_uuid, **version.dict())


@version_router.get('/{prompt_uuid}/version', response=List[PromptVersionOutSchema])
async def get_all_versions(request, prompt_uuid: UUID):
    """
    Get all versions for a prompt
    """
    qs = PromptVersion.objects.filter(prompt__uuid=prompt_uuid).all()
    return await convert_query_set_to_list(qs)


@version_router.get('/{prompt_uuid}/version/{uuid}', response=PromptVersionOutSchema)
async def get_version(request, prompt_uuid: UUID, uuid: UUID):
    """
    Get the version by uuid
    """
    return await aget_object_or_404(PromptVersion, prompt__uuid=prompt_uuid, uuid=uuid)


@version_router.put('/{prompt_uuid}/version/{uuid}', response=PromptVersionOutSchema)
async def update_version(request, prompt_uuid: UUID, uuid: UUID, version: PromptVersionUpdateSchema):
    """
    Update an existing version
    """
    obj = await aget_object_or_404(PromptVersion, prompt__uuid=prompt_uuid, uuid=uuid)
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
    await obj.delete()
    return {'success': True}
