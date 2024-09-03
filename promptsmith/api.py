from ninja import NinjaAPI, Router

from core.routers import core_router

api = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)

#  router for management through dashboard and in the future through API
management_router = Router()
management_router.add_router("/", core_router)


# sdk router, focused on serving the SDK, so mainly for read operations
sdk_router = Router()

api.add_router("/sdk/", sdk_router) # we use key for sdk

api.add_router("/", management_router) # we use UUID for management
