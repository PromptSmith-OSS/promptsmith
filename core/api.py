from ninja import Router
from .models.prompt import Prompt
from .schemas.prompt import PromptSchema as PromptInSchema, PromptSchema as PromptOutSchema
from django.shortcuts import get_object_or_404, aget_object_or_404

router = Router()


@router.get('/prompt/{unique_key}', response=PromptOutSchema)
async def get_prompt(request, unique_key: str):
    """
    Get the prompt by uuid
    """
    return await aget_object_or_404(Prompt, unique_key=unique_key)


@router.post('/prompt', response=PromptOutSchema)
async def create_prompt(request, prompt: PromptInSchema):
    """
    Create a new prompt
    """
    return await Prompt.objects.acreate(**prompt.dict())
