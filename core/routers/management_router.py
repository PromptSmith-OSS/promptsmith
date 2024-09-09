from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from ninja import Router

from core.auth import ManagementAuthBearer
from .prompt import prompt_router
from .prompt_variant import prompt_variant_router
from .prompt_version import version_router

management_router = Router(
    throttle=[
        AnonRateThrottle('10/s'),
        AuthRateThrottle('100/s'),
    ],
    auth=ManagementAuthBearer(),
)


@management_router.get("/protected-ping")
def ping(request):
    """
    Ping the server - Protected Health Check
    :param request:
    :return:
    """
    return {"ping": "pong"}


management_router.add_router("/prompt/", prompt_router)
management_router.add_router("/prompt/", prompt_variant_router)
management_router.add_router("/prompt/", version_router)
