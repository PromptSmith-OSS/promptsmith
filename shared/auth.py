import os
from typing import Optional, Any

from django.contrib.auth.models import User
from django.http import HttpRequest

from ninja.errors import AuthenticationError
from ninja.security import HttpBearer, SessionAuth
from asgiref.sync import sync_to_async


class SDKAuthBearer(HttpBearer):
    def authenticate(self, request, token) -> bool:
        if token == os.getenv('SDK_KEY'):
            return True
        else:
            raise AuthenticationError('Invalid token')


class ManagementAuthBearer(HttpBearer):
    def authenticate(self, request, token) -> bool:
        if token == os.getenv('MANAGEMENT_KEY'):
            return True
        else:
            raise AuthenticationError('Invalid token')


class AsyncDjangoNinjaAuth(SessionAuth):
    """
    Reusing Django session authentication
    This decouple the authentication from Ninja routers and Django All Auth
    https://docs.allauth.org/en/latest/headless/openapi-specification/
    """
    async def authenticate(self, request: HttpRequest, key: Optional[str]) -> Optional[User]:
        """
        Authenticate the user
        Get session id from cookies
        Or get from headers X-Session-Token
        :param request:
        :param key:
        :return:
        """
        # scheme = request.scheme
        # # Get the host (domain + port)
        # host = request.get_host()
        # # Combine scheme and host to get the full origin
        # origin = f"{scheme}://{host}"
        # print('origin', origin)
        return await (sync_to_async(super().authenticate))(request, key)


async_django_ninja_auth = AsyncDjangoNinjaAuth()


