from ninja import NinjaAPI
import core.api

api = NinjaAPI(
    version="1.0.0",
)

api.add_router("/", core.api.router)
