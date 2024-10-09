import random
from typing import List

from allauth.account.utils import Optional
from django.db import models
# import 404 error
from django.http import Http404
from django.shortcuts import aget_list_or_404
from ninja import Router
from ninja.throttling import AnonRateThrottle, AuthRateThrottle

from core_sdk.auth import ProjectKeyAuthentication as SDKAuthBearer
from core.models import PromptVariant, PromptVersion
from core_sdk.schema import SDKPromptSchema
from decimal import Decimal

sdk_router = Router(
    tags=['SDK'],
    throttle=[
        AnonRateThrottle('50/s'),
        AuthRateThrottle('500/s'),
    ],
    auth=SDKAuthBearer(),
)


def random_choose_variant(variants: List[dict]) -> dict:
    """
    Randomly choose the variant based on the percentage
    :param variants:
    :return:
    """

    if len(variants) == 1:
        return variants[0]

    total_percentage = sum([float(variant.get('percentage', 0)) for variant in variants])

    if total_percentage == 0:
        return variants[0]

    probabilities = [float(variant.get('percentage', 0)) / total_percentage for variant in variants]

    # Pick a number based on the probabilities
    variant = (random.choices(variants, weights=probabilities, k=1))[0]
    return variant


@sdk_router.get("/protected-ping")
def ping(request):
    """
    Ping the server - Protected Health Check
    :param request:
    :return:
    """
    return {"ping": "pong"}


@sdk_router.get('/prompt/{prompt_key}', response=SDKPromptSchema)
async def get_prompt(request, prompt_key: str, distinct_id: Optional[str] = None, llm_model_name: Optional[str] = None):
    """
    Get the prompt by prompt key
    - Get prompt
    - Get related variants
    - Get related versions based on the version uuid from the variant
    """

    project = request.auth.project

    prompt_variant_qs = PromptVariant.objects.select_related('prompt').filter(prompt__unique_key=prompt_key,
                                                                              prompt__project=project)

    if llm_model_name:
        prompt_variant_qs = prompt_variant_qs.filter(llm_model_name=llm_model_name)

    prompt_variant_qs = prompt_variant_qs.annotate(
        unique_key=models.F('prompt__unique_key'),
        description=models.F('prompt__description'),
    ).values(
        'uuid',
        'percentage',
        # prompt
        'unique_key',
        'name',  # variant name
        'description',  # prompt description
        # version
        'selected_version_uuid',
        'llm_model_name',
    )

    if distinct_id:
        # based on the distinct id, get the segment then get the prompt variant
        prompt_variant_qs = prompt_variant_qs.select_related('segment').filter(
            segment__distinct_ids__contains=[distinct_id])
        prompt_variant = await prompt_variant_qs.afirst()

    else:
        # get the random prompt variant based on the weight percentage
        all_prompt_variants = await aget_list_or_404(prompt_variant_qs)
        # choose the prompt variant based on the percentage
        prompt_variant = random_choose_variant(all_prompt_variants)

    # use selected version uuid from the variant to get the version content
    version_qs = PromptVersion.objects.filter(variant__uuid=prompt_variant['uuid']).values(
        'uuid',
        'name',
        'content',
    )

    # find latest version
    version = await (version_qs.order_by('-created_at')).afirst()
    if not version:
        raise Http404("Prompt not found")

    version['llm_model_name'] = prompt_variant['llm_model_name']
    version['unique_key'] = prompt_variant['unique_key']
    version['description'] = prompt_variant['description']
    version['percentage'] = prompt_variant['percentage']

    return version
