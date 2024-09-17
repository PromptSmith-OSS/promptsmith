import os
from typing import Optional, Any

from django.contrib.auth import aget_user
from django.http import HttpRequest

from ninja.errors import AuthenticationError
from ninja.security import HttpBearer, SessionAuth


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
        user = await aget_user(request)
        if user.is_authenticated:
            return user
        return None


async_django_auth = AsyncDjangoAuth()
