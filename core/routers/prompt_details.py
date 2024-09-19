from typing import List

from django.shortcuts import aget_list_or_404
from ninja import Router
from ninja.pagination import paginate

from core.models.prompt import Prompt
from core.schemas.prompt import PromptOutSchema

prompt_details_router = Router(
    tags=['Prompt with details'],
)

@prompt_details_router.get('/', response=List[PromptOutSchema])
@paginate
async def get_all_prompts_with_details(request):
    """
    Get all prompts with related variants and versions
    """
    qs = Prompt.objects.all()
    # todo ref SDK route
    # todo use number for fk and use select_related to export the uuid or unique key out
    return await aget_list_or_404(qs)



