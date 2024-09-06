from ninja import NinjaAPI, Router
from ninja.throttling import AnonRateThrottle, AuthRateThrottle
from core.routers import core_router
from core.routers.sdk import sdk_router

"""
Session or cookie based authentication for management API
CORS allow front-end to access the API
"""
general_api = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)

#  router for management through dashboard and in the future through API
management_router = Router(
    throttle=[
        AnonRateThrottle('10/s'),
        AuthRateThrottle('100/s'),
    ],
    auth=None,
)
management_router.add_router("/", core_router)

general_api.add_router("/", management_router)  # we use UUID for management
general_api.add_router("/sdk/", sdk_router)  # we use key for sdk

api = general_api
