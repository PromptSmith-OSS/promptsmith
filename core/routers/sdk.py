from ninja import Router
from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from core.simple_auth import SimpleAuthBearer

sdk_router = Router(
    tags=['SDK'],
    throttle=[
        AnonRateThrottle('50/s'),
        AuthRateThrottle('500/s'),
    ],
    auth=SimpleAuthBearer(),
)


@sdk_router.get('/prompt/{prompt_uuid}/')
def get_prompt(request, prompt_uuid: str):
    """
    Get the prompt by uuid
    """
    return {'prompt_uuid': prompt_uuid}
