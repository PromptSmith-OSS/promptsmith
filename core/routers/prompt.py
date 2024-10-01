from typing import List
from uuid import UUID

from django.db import models
from django.shortcuts import aget_object_or_404, aget_list_or_404
from ninja import Router
from ninja.pagination import paginate

from core.models.prompt import Prompt
from core.schemas.prompt import PromptCreateSchema, PromptDetailOutSchema, PromptOutSchema, PromptUpdateSchema
from shared.errors import raise_duplication_error

prompt_router = Router(
    tags=['Prompt'],
)


@prompt_router.post('', response=PromptOutSchema)
async def create_prompt(request, prompt: PromptCreateSchema):
    """
    Create a new prompt
    """
    project_uuid = request.auth.project.uuid
    # validate the unique_key
    if await Prompt.objects.filter(unique_key=prompt.unique_key, project__uuid=project_uuid).aexists():
        raise raise_duplication_error('unique_key', prompt.unique_key)
    return await Prompt.objects.acreate(
        **prompt.dict(),
        project=request.auth.project,
    )


@prompt_router.get('', response=List[PromptOutSchema])
@paginate
async def get_all_prompts(request):
    """
    Get all prompts
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(
        project__uuid=project_uuid
    ).annotate(
        project_uuid=models.F('project__uuid'),
    )
    results = await aget_list_or_404(qs)
    return results


@prompt_router.get('/{uuid}', response=PromptOutSchema)
async def get_prompt(request, uuid: UUID):
    """
    Get the prompt by uuid
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(uuid=uuid, project__uuid=project_uuid).annotate(
        project_uuid=models.F('project__uuid'))
    return await aget_object_or_404(qs)


@prompt_router.get('/{uuid}/detail', response=PromptDetailOutSchema)
async def get_prompt_with_variants_versions(request, uuid: UUID):
    """
    Get the prompt by uuid
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(uuid=uuid, project__uuid=project_uuid).prefetch_related('variants', 'variants__versions').annotate(
        project_uuid=models.F('project__uuid')
    )

    return await aget_object_or_404(qs)


@prompt_router.get('/key/{unique_key}', response=PromptOutSchema)
async def get_prompt_by_key(request, unique_key: str):
    """
    Get the prompt by uuid
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(unique_key=unique_key, project__uuid=project_uuid).annotate(
        project_uuid=models.F('project__uuid'))
    return await aget_object_or_404(qs)


@prompt_router.put('/{uuid}', response=PromptOutSchema)
async def update_prompt(request, uuid: UUID, prompt: PromptUpdateSchema):
    """
    Update an existing prompt
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(uuid=uuid, project__uuid=project_uuid)
    obj = await aget_object_or_404(qs)
    # Update fields except for 'uuid'
    for k, v in prompt.dict().items():
        if v is not None and k != "uuid":
            setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_router.delete('/{uuid}', response=dict)
async def delete_prompt(request, uuid: UUID):
    """
    Delete a prompt
    """
    project_uuid = request.auth.project.uuid
    qs = Prompt.objects.filter(uuid=uuid, project__uuid=project_uuid).annotate(
        project_uuid=models.F('project__uuid'))
    obj = await aget_object_or_404(qs)
    await obj.adelete()
    return {'status': 'deleted'}
