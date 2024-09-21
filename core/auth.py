import os
from typing import Optional, Any

from django.contrib.auth import aget_user
from django.http import HttpRequest

from ninja.errors import AuthenticationError
from ninja.security import HttpBearer, SessionAuth, django_auth
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


class AsyncDjangoAuth(SessionAuth):
    """
    Reusing Django session authentication
    This decouple the authentication from Ninja routers and Django All Auth
    https://docs.allauth.org/en/latest/headless/openapi-specification/
    """
    async def authenticate(self, request: HttpRequest, key: Optional[str]) -> Optional[Any]:
        """
        Authenticate the user
        Get session id from cookies
        Or get from headers X-Session-Token
        :param request:
        :param key:
        :return:
        """
        print('AsyncDjangoAuth.authenticate', request, key, )
        # scheme = request.scheme
        # # Get the host (domain + port)
        # host = request.get_host()
        # # Combine scheme and host to get the full origin
        # origin = f"{scheme}://{host}"
        # print('origin', origin)
        return sync_to_async(super().authenticate)(request, key)


async_django_auth = AsyncDjangoAuth()
