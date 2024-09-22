from typing import List
from uuid import UUID

from django.shortcuts import aget_object_or_404, aget_list_or_404
from ninja import Router
from ninja.pagination import paginate
from ninja.errors import AuthenticationError, ValidationError

from core.models.prompt import Prompt
from core.schemas.prompt import PromptCreateSchema, PromptOutSchema, PromptUpdateSchema
from shared.errors import raise_duplication_error
from project.models import Project
from user_organization.models import Organization

prompt_router = Router(
    tags=['Prompt'],
)


@prompt_router.post('', response=PromptOutSchema)
async def create_prompt(request, prompt: PromptCreateSchema):
    """
    Create a new prompt
    """

    # validate the unique_key
    if await Prompt.objects.filter(unique_key=prompt.unique_key).aexists():
        raise raise_duplication_error('unique_key', prompt.unique_key)
    return await Prompt.objects.acreate(**prompt.dict())


@prompt_router.get('', response=List[PromptOutSchema])
@paginate
async def get_all_prompts(request):
    """
    Get all prompts
    """
    project_uuid = request.headers.get('X-Project-UUID')
    qs = Prompt.objects.filter(
        project__uuid=project_uuid
    )
    return await aget_list_or_404(qs)


@prompt_router.get('/{uuid}', response=PromptOutSchema)
async def get_prompt(request, uuid: UUID):
    """
    Get the prompt by uuid
    """
    return await aget_object_or_404(Prompt, uuid=uuid)


@prompt_router.get('/key/{unique_key}', response=PromptOutSchema)
async def get_prompt_by_key(request, unique_key: str):
    """
    Get the prompt by uuid
    """
    return await aget_object_or_404(Prompt, unique_key=unique_key)


@prompt_router.put('/{uuid}', response=PromptOutSchema)
async def update_prompt(request, uuid: UUID, prompt: PromptUpdateSchema):
    """
    Update an existing prompt
    """
    obj = await aget_object_or_404(Prompt, uuid=uuid)
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
    obj = await aget_object_or_404(Prompt, uuid=uuid)
    await obj.adelete()
    return {'success': True}
