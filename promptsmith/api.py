from ninja import NinjaAPI
import core.api

api = NinjaAPI(
    version="1.0.0",
# openapi_url=None, # to disable auto generated openapi docs
)

api.add_router("/", core.api.router)
