from ninja import Router
from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from core.simple_auth import SimpleAuthBearer
from core.schemas.sdk import PromptSchema
from django.db import models

from core.models import Prompt, PromptVariant, PromptVersion

sdk_router = Router(
    tags=['SDK'],
    throttle=[
        AnonRateThrottle('50/s'),
        AuthRateThrottle('500/s'),
    ],
    auth=SimpleAuthBearer(),
)


@sdk_router.get('/prompt/{prompt_key}/', response=PromptSchema)
async def get_prompt(request, prompt_key: str, distinct_id: str = None):
    """
    Get the prompt by prompt key
    - Get prompt
    - Get related variants
    - Get related versions based on the version uuid from the variant
    """
    qs = PromptVariant.objects.select_related('prompt').filter(prompt__unique_key=prompt_key)

    if distinct_id:
        qs = qs.select_related('segment').filter(segment__distinct_ids__contains=[distinct_id])
    else:
        qs = qs.select_related('segment')

    qs = qs.annotate(
        unique_key=models.F('prompt__unique_key'),
    ).values(
        'unique_key',
        'prompt__description',
        'prompt__created_at',
        'prompt__updated_at',
        'selected_version_uuid',
    )
    # use selected version uuid to get the version through qs

    prompt = await qs.afirst()

    if prompt['selected_version_uuid']:

        version = await PromptVersion.objects.aget(uuid=prompt['selected_version_uuid'])
    else:
        # find latest version
        version = await PromptVersion.objects.filter(prompt__unique_key=prompt_key).order_by('-created_at').afirst()



    prompt['context'] = version.content
    return prompt
