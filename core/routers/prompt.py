from django.shortcuts import aget_object_or_404
from ninja import Router

from shared.utils import convert_query_set_to_list
from .prompt_variant import prompt_variant_router
from ..models.prompt import Prompt
from ..schemas.prompt import PromptInSchema, PromptOutSchema
from typing import List

prompt_router = Router(
    tags=['Prompt'],
)


@prompt_router.get('/', response=List[PromptOutSchema])
async def get_all_prompts(request):
    """
    Get all prompts
    """
    qs = Prompt.objects.all()
    return await convert_query_set_to_list(qs)


@prompt_router.get('/{uuid}', response=PromptOutSchema)
async def get_prompt(request, uuid: str):
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


@prompt_router.post('/', response=PromptOutSchema)
async def create_prompt(request, prompt: PromptInSchema):
    """
    Create a new prompt
    """
    return await Prompt.objects.acreate(**prompt.dict())


@prompt_router.put('/{uuid}', response=PromptOutSchema)
async def update_prompt(request, uuid: str, prompt: PromptInSchema):
    """
    Update an existing prompt
    """
    obj = await aget_object_or_404(Prompt, uuid=uuid)
    for k, v in prompt.dict().items():
        if v is not None:
            setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_router.delete('/{uuid}')
async def delete_prompt(request, uuid: str):
    """
    Delete a prompt
    """
    obj = await aget_object_or_404(Prompt, uuid=uuid)
    await obj.adelete()
    return {'success': True}


# to make something like /prompt/{prompt_unique_key}/variant/{unique_key}
prompt_router.add_router("/", prompt_variant_router)
