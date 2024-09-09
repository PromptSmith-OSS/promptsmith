from ninja import NinjaAPI, Router
from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from core.routers.sdk import sdk_router
from core.routers.management_router import management_router

"""
Session or cookie based authentication for management API
CORS allow front-end to access the API
"""
general_api = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)


@general_api.get("/ping")
def ping(request):
    """
    Ping the server - Public Health Check
    :param request:
    :return:
    """
    return {"ping": "pong"}

general_api.add_router("/", management_router)  # we use UUID for management
general_api.add_router("/sdk/", sdk_router)  # we use key for sdk

api = general_api
