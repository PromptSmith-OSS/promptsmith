from ninja import NinjaAPI
from core.routers.prompt import prompt_router

api = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)

api.add_router("/prompt/", prompt_router)
