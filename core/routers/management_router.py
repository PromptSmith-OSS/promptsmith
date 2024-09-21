from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from ninja import Router

from ..auth import async_core_resource_auth
from shared.auth import async_django_ninja_auth
from .prompt import prompt_router
from .prompt_variant import prompt_variant_router
from .prompt_version import version_router
from .prompt_details import prompt_details_router

management_router = Router(
    throttle=[
        AnonRateThrottle('10/s'),
        AuthRateThrottle('100/s'),
    ],
    auth=async_core_resource_auth,
    # use default django auth, in this case, it is django all auth headless auth (cookie or token)
)


@management_router.get("/protected-ping")
def ping(request):
    """
    Ping the server - Protected Health Check
    :param request:
    :return:
    """
    return {"ping": "pong"}


# the core CRUD endpoints
management_router.add_router("/prompt", prompt_router)
management_router.add_router("/prompt", prompt_variant_router)
management_router.add_router("/prompt", version_router)
management_router.add_router("/prompt-details", prompt_details_router)
