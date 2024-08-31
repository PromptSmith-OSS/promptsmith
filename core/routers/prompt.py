from ninja import Router
from ..models.prompt import Prompt
from ..schemas.prompt import PromptInSchema, PromptOutSchema, PromptUpdateSchema
from django.shortcuts import get_object_or_404, aget_object_or_404
from .prompt_variant import prompt_variant_router

prompt_router = Router(
    tags=['Prompt'],
)


@prompt_router.get('/{unique_key}', response=PromptOutSchema)
async def get_prompt(request, unique_key: str):
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


@prompt_router.put('/{unique_key}', response=PromptOutSchema)
async def update_prompt(request, unique_key: str, prompt: PromptUpdateSchema):
    """
    Update an existing prompt
    """
    obj = await aget_object_or_404(Prompt, unique_key=unique_key)
    for k, v in prompt.dict().items():
        if v is not None:
            setattr(obj, k, v)
    await obj.asave()
    return obj


@prompt_router.delete('/{unique_key}')
async def delete_prompt(request, unique_key: str):
    """
    Delete a prompt
    """
    obj = await aget_object_or_404(Prompt, unique_key=unique_key)
    await obj.adelete()
    return {'success': True}


# to make something like /prompt/{prompt_key}/variant/{unique_key}
prompt_router.add_router("/", prompt_variant_router)

