from typing import List
from uuid import UUID

from django.shortcuts import aget_object_or_404
from ninja import Router
from ninja.pagination import paginate

from core.models.prompt import Prompt
from core.schemas.prompt import PromptCreateSchema, PromptOutSchema, PromptUpdateSchema
from shared.errors import raise_duplication_error
from shared.utils import convert_query_set_to_list

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

    print('query,', qs.query)

    return await convert_query_set_to_list(qs)

