import orjson
from ninja import NinjaAPI
from ninja.renderers import BaseRenderer

from core.routers.management_router import management_router
from core_sdk.router import sdk_router
from project.routers.project_router import project_router


class ORJSONRenderer(BaseRenderer):
    media_type = "application/json"

    def render(self, request, data, *, response_status):
        return orjson.dumps(data)


"""
Session or cookie based authentication for management API
CORS allow front-end to access the API
"""
general_api = NinjaAPI(
    version="1.0.0",
    renderer=ORJSONRenderer(),
    # openapi_url=None, # to disable auto generated openapi docs
)


# We have set up CORS in the settings.py file
# We don't need CSRF, because we are using Bearer token for authentication, Use an authentication method not automatically embedded in the request
#  https://django-ninja.dev/reference/csrf/


@general_api.get("/ping")
def ping(request):
    """
    Ping the server - Public Health Check
    :param request:
    :return:
    """
    return {"ping": "pong"}


# use uuid for endpoint below
general_api.add_router("/", management_router)
general_api.add_router('/project', project_router)
# we use key for sdk endpointd
general_api.add_router("/sdk", sdk_router)

api = general_api
