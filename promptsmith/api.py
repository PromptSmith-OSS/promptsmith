from ninja import NinjaAPI, Router

from core.routers import core_router

"""
Session or cookie based authentication for management API
CORS allow front-end to access the API
"""
management_api = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)

#  router for management through dashboard and in the future through API
management_router = Router()
management_router.add_router("/", core_router)

management_api.add_router("/", management_router)  # we use UUID for management

api = management_api
