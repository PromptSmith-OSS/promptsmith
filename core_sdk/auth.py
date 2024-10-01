from django.shortcuts import get_object_or_404
from ninja.errors import AuthenticationError
from ninja.security import HttpBearer

from core.models import APIKey


class ProjectKeyAuthentication(HttpBearer):
    """
    Authenticate the project key (private key or public key)
    """

    def authenticate(self, request, token) -> APIKey:
        # this is a client side token
        # this is for remote evaluation on customer client or server side
        try:
            return get_object_or_404(APIKey, key=token)
        except APIKey.DoesNotExist:
            raise AuthenticationError('Invalid token')
