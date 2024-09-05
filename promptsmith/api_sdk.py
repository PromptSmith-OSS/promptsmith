from ninja import NinjaAPI, Router

"""
Token based authentication for SDK
CORS allow client servers to access the API
"""
api_sdk = NinjaAPI(
    version="1.0.0",
    # openapi_url=None, # to disable auto generated openapi docs
)

# sdk router, focused on serving the SDK, so mainly for read operations
sdk_router = Router()

api_sdk.add_router("/sdk/", sdk_router)  # we use key for sdk
